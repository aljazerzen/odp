import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';


@Injectable()
export class ObjectIdPipe implements PipeTransform {
  constructor(private entity: string) {
  }

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      return ObjectId.createFromHexString(value);
    } catch (e) {
      throw new NotFoundException({ code: this.entity + '_NOT_FOUND' })
    }
  }
}