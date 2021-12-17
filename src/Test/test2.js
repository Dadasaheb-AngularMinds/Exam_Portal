import react, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getTestData } from "../service/service";

let c = 0
let w = 0

const Test2 = () => {

    let navigate = useNavigate()
    let location = useLocation()

    const [test, setTest] = useState(null)
    const [ansArray, setAnsArray] = useState(null)


    const getData = () => {
        const response = getTestData()
        return response
    }


    useEffect(() => {
        const get = async () => {
            const response = await getData()
            setTest(response)

            let localStore = JSON.parse(localStorage.getItem('selected'))

            const ansArray = response.questions ? response.questions.map((oneObj, index) => {
                let confirmData = Object.entries(localStore[index]).length
                let localInitialValue = Array(oneObj.options.length).fill(false)
                let choosedAns = []
                if (confirmData !== 0) {
                    localInitialValue = localStore[index].initialValue
                    choosedAns = localStore[index].choosedAns
                }

                return (
                    {
                        ...oneObj,
                        choosedAns: choosedAns,
                        initialValue: localInitialValue
                    }
                )
            }) : ''

            setAnsArray(ansArray)
        }
        get()

    }, [])


    const submit = () => {
        let res = window.confirm("Do you Really Want to SubMit The Test")
        if (res !== true)
            return

        const check = (oneObj) => {
            let correctAns = Array.isArray(oneObj.correctIndex) ? oneObj.correctIndex : [oneObj.correctIndex]
            let choosedAns = oneObj.choosedAns.join('')
            let toCorrectAns = correctAns.join('')

            if (choosedAns === toCorrectAns) {
                c++
            }
            else {
                w++
            }
        }

        ansArray.foreach(check)

        navigate('../finish', {
            state: {
                tName: test ? test.name : '',
                qNo: test.questions.length,
                correct: c,
                wrong: w
            }
        })
    }


    return (
        <div>
        </div>
    )
}

export default Test2