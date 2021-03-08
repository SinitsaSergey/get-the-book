import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

@Injectable()
export class BaseService<T extends ObjectLiteral> {
  protected repository: Repository<T>;

  async findOne(id: number, options?: FindOneOptions): Promise<T> {
    return this.repository.findOne(id, options);
  }

  async findOneOrFail(id: number, options?: FindOneOptions): Promise<T> {
    return this.repository.findOneOrFail(id, options);
  }

  async findAll(options: FindManyOptions): Promise<T[]> {
    return this.repository.find(options);
  }

  async save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  async delete(id: number): Promise<number> {
    return (await this.repository.delete(id)).affected;
  }
}
