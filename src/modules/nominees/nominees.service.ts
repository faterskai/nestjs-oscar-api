import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Nominee } from 'src/modules/nominees/schemas/nominee.schema';
import { Model } from 'mongoose';
import { CreateNomineeDto } from './dto/create-nominee.dto';
import { PaginatedResponse } from './../../common/dto/paginated-response.dto';
import { QueryNomineeDto } from './dto/query-nominee.dto';

@Injectable()
export class NomineesService {
  constructor(
    @InjectModel(Nominee.name)
    private readonly nomineeModel: Model<Nominee>,
  ) {}

  async create(createNomineeDto: CreateNomineeDto): Promise<Nominee> {
    const newNominee = new this.nomineeModel(createNomineeDto);
    const createdNominee = await newNominee.save();
    return createdNominee.toObject();
  }

  async findAll(filters: QueryNomineeDto): Promise<PaginatedResponse<Nominee>> {
    const query: any = {};

    // filtering
    if (filters.title) query.title = { $regex: filters.title, $options: 'i' };

    // sorting
    const sortField = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;

    // pagination
    const page = filters.page || 1; // Default: Page 1
    const limit = filters.limit || 10; // Default: 10 per page
    const skip = (page - 1) * limit;

    const nominees = await this.nomineeModel
      .find(query)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const totalNominees = await this.nomineeModel.countDocuments(query).exec();

    return {
      data: nominees,
      total: totalNominees,
      currentPage: page,
      totalPages: Math.ceil(totalNominees / limit),
    };
  }

  async findOne(id: string): Promise<Nominee> {
    const nominee: any = await this.nomineeModel.findById(id).lean().exec();

    if (!nominee) {
      throw new NotFoundException(`Nominee with ID ${id} not found`);
    }

    return nominee;
  }

  async update(
    id: string,
    updateNomineeDto: Partial<CreateNomineeDto>,
  ): Promise<Nominee> {
    const updatedNominee = await this.nomineeModel
      .findByIdAndUpdate(id, updateNomineeDto, { new: true })
      .lean()
      .exec();

    if (!updatedNominee) {
      throw new NotFoundException(`Nominee with ID ${id} not found`);
    }

    return updatedNominee;
  }
}
