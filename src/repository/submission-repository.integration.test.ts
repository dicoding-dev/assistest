import SubmissionRepository from "./submission-repository";

describe('Submission Repository Test', ()=> {
    it('should return access token properly', async function () {
        const submissionRepository = new SubmissionRepository()

        const detailAccessToken = await submissionRepository.getDetailAccessToken()
        expect( detailAccessToken.token_type).toEqual("Bearer")
        expect( detailAccessToken.expires_in).toEqual(3600)
        expect( detailAccessToken.access_token).toBeDefined()
    });
})