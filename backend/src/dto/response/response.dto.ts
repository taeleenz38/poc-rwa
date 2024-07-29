export class ApplicantResponse {
    id: string;
    constructor(id: string) {
        this.id = id;
    }
}

export class ReviewResponse {
    reviewStatus: string;
    reviewAnswer?: string;
    constructor(reviewStatus: string,reviewAnswer?: string) {
        this.reviewStatus = reviewStatus;
        this.reviewAnswer = reviewAnswer;
    }
}