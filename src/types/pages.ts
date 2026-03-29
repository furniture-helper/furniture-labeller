export type GetPageResponse = {
    url: string;
    signedUrl: string;
    minimizedSignedUrl: string;
    s3_key: string;
}

export type GetPagePredictionResponse = {
    type: string;
}