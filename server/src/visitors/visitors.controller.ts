import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ListVisitorsQueryDto } from './dto/list-visitors-query.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { VisitorsService } from './visitors.service';

@Controller('visitors')
@UseGuards(JwtAuthGuard)
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Get('status')
  getStatus() {
    return this.visitorsService.getStatus();
  }

  @Get()
  listVisitors(@Query() query: ListVisitorsQueryDto) {
    return this.visitorsService.listVisitors(query);
  }

  @Get(':id')
  getVisitor(@Param('id') id: string) {
    return this.visitorsService.getVisitor(id);
  }

  @Patch(':id')
  updateVisitor(@Param('id') id: string, @Body() body: UpdateVisitorDto) {
    return this.visitorsService.updateVisitor(id, body);
  }
}
