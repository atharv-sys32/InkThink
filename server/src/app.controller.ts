import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Health check endpoint for Render
  @Get('health')
  getHealth(): { status: string } {
    return { status: 'ok' };
  }
}
