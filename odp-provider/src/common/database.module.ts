import { Inject, Module, Provider } from '@nestjs/common';
import { connect, MongoClient } from 'mongodb';
import { ClassType, Repository, RepositoryOptions } from 'mongodb-typescript';

const MONGO_TOKEN = 'MONGODB';

function getRepoToken(Type: ClassType<any>) {
  return Type.name + '_REPO';
}

export function InjectRepo(Type: ClassType<any>) {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    Inject(getRepoToken(Type))(target, propertyKey, parameterIndex);
  }
}

function getDefaultCollectionName<T>(Type: ClassType<T>) {
  const singular = Type.name.toLowerCase();
  return singular + (singular.substr(-1) === 's' ? 'es' : 's');
}

export function forRepository<T>(
  Type: ClassType<T>,
  collection?: string,
  options: RepositoryOptions = { autoIndex: true },
) {
  return {
    provide: getRepoToken(Type),
    inject: [MONGO_TOKEN],
    useFactory: async (mongo: MongoClient) => {
      return new Repository<T>(
        Type,
        mongo,
        collection || getDefaultCollectionName<T>(Type),
        options,
      );
    },
  };
}

/**
 * @param url URL of the mongodb database (new url format eg. mongodb://localhost:27017/my-database)
 */
export function forRoot(url: string) {
  return {
    provide: MONGO_TOKEN,
    useFactory: async () => {
      const opts = { useNewUrlParser: true, useUnifiedTopology: true };

      return connect(url, opts).catch(async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return connect(url, opts);
      });
    },
  };
}


const providers: Provider[] = [
  forRoot(process.env.MONGO_URL ?? 'mongodb://localhost:27017/odp'),
];

@Module({
  providers,
  exports: providers
})
export class DatabaseModule { }