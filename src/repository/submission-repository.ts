import axios from "axios";
import * as FormData from 'form-data'
import * as dotenv from 'dotenv'

dotenv.config()

class SubmissionRepository {
    async getDetailAccessToken() {
        const data = new FormData();
        data.append('grant_type', 'client_credentials');
        data.append('client_id', process.env.DICODING_API_CLIENT_ID);
        data.append('client_secret', process.env.DICODING_API_SECRET);

        const response = await axios.post(`${process.env.DICODING_API_BASE_URL}/oauth/access_token`, data)

        return response.data
    }
}

export default SubmissionRepository
