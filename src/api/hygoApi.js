import axios from 'axios';

export const trackerApi = axios.create(
{
 baseURL: 'http://34.245.109.190:3000',
 timeout: 1000,
});
/*
trackerApi.interceptors.request.use(request => {
    console.log('Starting Request', request)
    return request
   })
*/
export const signUp = async (email, password) => {
    try
    {
        const response =  await trackerApi.post('/signup', {email, password});
        return ({
            token: response.data.token,
            errorMessage: ''
        });
    } catch(err)
    {
        console.log(err)
        return ({
            token: '',
            errorMessage: 'Error while signing up'
        });
    }
}

export const signInWithBarCode = async (barcode) => {
    try
    {
        console.log(barcode + 'nad4');
        const response =  await trackerApi.post('/signinwithbarcode',{barcode});
            console.log(response+ 'nad5');
        
        
        return ({
            token: response.data.token,
            userName: response.data.userName,
            errorMessage: ''
        });
    } catch(err)
    {
        console.log(err);
        return ({
            token: '',
            errorMessage: 'Error while signing up'
        });
    }
}

export const checkToken = async (token) => {
    if (!token) {
        return ({
            errorMessage: 'No Token',
            userName: ''
        });
    }
    else {
        try{
            const response = await trackerApi.post('/checkToken', {token});
            return ({
                errorMessage: '',
                userName: response.data.userName
            });
        }
        catch(err) {
            return ({
                errorMessage: 'Invalide stored token',
                userName: ''
            });
        }
    }
}

export const getLastValue = async(token, valueType) => {
    if(token) {
        try {
            const response  = await trackerApi.post('/getLastValue', {token, valueType});
            const {value} = response.data;
            return ({
                value
            });

        } catch(error) {
            return ({
                value: ''
            });
        }
    }
}