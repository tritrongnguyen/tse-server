import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { GroupModule } from './group/group.module';
import { ActivityModule } from './activity/activity.module';
import { AttendanceModule } from './attendance/attendance.module';
import { appEntities } from './entities';
import { MailerModule } from '@nestjs-modules/mailer';
import { QnaCategoriesModule } from './qna-categories/qna-categories.module';
import { QuestionsModule } from './questions/questions.module';
import { AnswersModule } from './answers/answers.module';
import { CommentsModule } from './comments/comments.module';
import { VotesModule } from './votes/votes.module';
import { TagsController } from './tags/tags.controller';
import { TagsService } from './tags/tags.service';
import { TagsModule } from './tags/tags.module';
import { QuestionTagsModule } from './question-tags/question-tags.module';
import { QuestionTagsController } from './question-tags/question-tags.controller';
import { QuestionTagsService } from './question-tags/question-tags.service';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.MYSQL_DB_NAME,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      synchronize: true,
      entities: appEntities,
      extra: {
        supportBigNumbers: true,
        bigNumberStrings: false,
      },
    }),
    AuthModule,
    UsersModule,
    GroupModule,
    ActivityModule,
    AttendanceModule,
    // mail
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@localhost>',
      },
    }),
    QnaCategoriesModule,
    QuestionsModule,
    AnswersModule,
    CommentsModule,
    VotesModule,
    TagsModule,
    QuestionTagsModule,
  ],
  controllers: [TagsController, QuestionTagsController],
  providers: [TagsService, QuestionTagsService],
})
export class AppModule {}
