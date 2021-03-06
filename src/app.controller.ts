import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Redirect('graphql')
  goToPlayground(): string {
    return 'You are going to graphql playground';
  }
}
