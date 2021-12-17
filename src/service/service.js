import api from './api'

export const getAllTestID = async() => {
    const response = await api.get('/getQuizData');
    return response.data.tests;
}

export const getTestData = async(index) => {
    const response = await api.get('/getQuizData');
    // console.log(response);
    return response.data.tests[index];
}
export const getQuestionData = async (index) => {
    const response = await api.get('/getQuizData')
    // console.log(response);
    return response.data.tests[index].questions
    
}

