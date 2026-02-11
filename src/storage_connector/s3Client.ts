import {GetObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET;
const AWS_REGION = process.env.AWS_REGION || 'eu-west-1';

const s3 = new S3Client({region: AWS_REGION});

export class s3Client {

    public static getUrl(key: string): string {
        if (!S3_BUCKET_NAME) {
            throw new Error('AWS_S3_BUCKET environment variable is not set');
        }
        return `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
    }

    public static async getSignedUrl(key: string, expiresInSeconds: number = 60): Promise<string> {
        if (!S3_BUCKET_NAME) {
            throw new Error('AWS_S3_BUCKET environment variable is not set');
        }

        const command = new GetObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: key,
        });

        return getSignedUrl(s3, command, {expiresIn: expiresInSeconds});
    }

    public static async getObject(key: string): Promise<string> {
        if (!S3_BUCKET_NAME) {
            throw new Error('AWS_S3_BUCKET environment variable is not set');
        }

        const command = new GetObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: key,
        });

        const response = await s3.send(command);
        if (!response.Body) {
            throw new Error("S3 object has no body");
        }
        return response.Body.transformToString();
    }
}
