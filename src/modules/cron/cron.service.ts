import { Injectable, Logger } from "@nestjs/common"

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name)

  // @Cron("45 * * * * *")
  // handleCron() {
  //   this.logger.debug("Called when the current second is 45")
  // }
}
