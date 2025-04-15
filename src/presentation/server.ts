import { LogSeverityLevel } from "../domain/entities/log.entity"
import { CheckService } from "../domain/use-cases/checks/check-service"
import { CheckServiceMultiple } from "../domain/use-cases/checks/check-service-multiple"
import { SendEmailLogs } from "../domain/use-cases/email/send-email-logs"
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource"
import { MongoLogDatasource } from "../infrastructure/datasources/mongo-log.datasource"
import { PostgresLogDatasource } from "../infrastructure/datasources/postgres-log.datasource"
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl"
import { CronService } from "./cron/cron-service"
import { EmailService } from "./email/email.service"



const fsLogRepository = new LogRepositoryImpl(
    new FileSystemDatasource(),
)

const mongoLogRepository = new LogRepositoryImpl(
    new MongoLogDatasource(),
)

const postgreLogRepository = new LogRepositoryImpl(
    new PostgresLogDatasource(),
)

const emailService = new EmailService()

export class Server {

    public static async start() {

        console.log('Server started...')     
        
        CronService.createJob(
            '*/5 * * * * *',
            () => {
                const url = 'https://google.com'
                new CheckServiceMultiple(
                    [fsLogRepository, mongoLogRepository, postgreLogRepository],
                    () => console.log(`${url} is ok`),
                    (error) => console.log(error)
                ).execute(url)
            }
        )
    }

}