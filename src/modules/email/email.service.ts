import { randomUUID } from "crypto"
import { Injectable, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

import { render } from "@react-email/render"
import WelcomeEmail from "emails/welcome"
import { Resend } from "resend"

import { PrismaService } from "src/prisma/prisma.service"

import { UsersService } from "@modules/users/users.service"

@Injectable()
export class EmailService {
  private logger: Logger
  private resend: Resend

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService
  ) {
    this.resend = new Resend(this.configService.get("RESEND_API_KEY"))
    this.logger = new Logger(EmailService.name)
  }

  sendWelcomeEmail(userId: string) {
    this.sendEmail(userId, "Welcome to Trendmall", "...")
  }

  async sendInviteNewUserToBusinessEmail(userId: string) {
    const { fullName } = await this.usersService.findOneById(userId)

    this.sendEmail(
      userId,
      "You have been invited to join a business",
      render(WelcomeEmail({ fullName }))
    )
  }

  private async sendEmail(userId: string, subject: string, html: string) {
    this.logger.log(`Sending email to user ${userId}`)

    const { email } = await this.usersService.findOneById(userId)

    this.logger.log(`Sending email to ${email}`)

    const res = await this.resend.emails.send({
      from: "Trendmall <no-reply@trendmall.com>",
      to: email,

      subject,
      html,
      headers: {
        "X-Entity-Ref-ID": randomUUID(),
      },
    })

    this.logger.log(`Email sent to ${email}`)

    if (res.error) {
      this.logger.error(res.error.name)
      throw new Error(res.error.name)
    }
  }
}
