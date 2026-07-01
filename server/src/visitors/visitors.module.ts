import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { VisitorsController } from './visitors.controller';
import { VisitorRepository } from './visitor.repository';
import { VisitorsService } from './visitors.service';

@Module({
  imports: [AuthModule],
  controllers: [VisitorsController],
  providers: [VisitorsService, VisitorRepository],
  exports: [VisitorsService, VisitorRepository],
})
export class VisitorsModule {}
