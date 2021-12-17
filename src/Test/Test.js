import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getTestData } from '../service/service';
let c = 0;
let w = 0;
const Test = () => {
    //routers
    let location = useLocation();
    let navigate = useNavigate();
    //useState
    const [test, setTest] = useState(null);
    const [ansArray, setAnsArray] = useState(null);
    //----------------for getting single object of tests array
    const getData = () => {
        const response = getTestData(location.state.index);
        return response;
    }

    //--**************************** paginaton
    const [currentPage, setCurrentPage] = useState(Number(localStorage.getItem('currentpage')));
    // eslint-disable-next-line no-unused-vars
    const [itemPerPage, setItemPerPage] = useState(1);
    const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(1);
    const [minPageNumberLimit, setminPageNumberLimit] = useState(0);
    const pages = [];
    for (let i = 1; i <= Math.ceil(ansArray ? ansArray.length : 1 / itemPerPage); i++) {
        pages.push(i);
    }
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentItem = ansArray ? ansArray.slice(indexOfFirstItem, indexOfLastItem) : '';
    const handleNext = () => {
        setCurrentPage(currentPage + 1);
        if (currentPage + 1 > maxPageNumberLimit) {
            setmaxPageNumberLimit(maxPageNumberLimit + 1);
            setminPageNumberLimit(minPageNumberLimit + 1);
        }
    }
    const handlePrev = () => {
        setCurrentPage(currentPage - 1);
        if ((currentPage - 1) === 0) {
            setmaxPageNumberLimit(maxPageNumberLimit - 1);
            setminPageNumberLimit(minPageNumberLimit - 1);
        }
    }
    ///------------************************* End Pagigantion

    ///-----------************************* Use Effects
    useEffect(() => {
        const get = async () => {
            const response = await getData();
            setTest(response);
            let localStore = JSON.parse(localStorage.getItem('selected'))
            // console.log(response.questions);
            const ansArray = response.questions ? response.questions.map((oneObj, index) => {
                // console.log("OneObj ",oneObj);
                let confirmData = Object.entries(localStore[index]).length;
                let localInitialValue = Array(oneObj.options.length).fill(false);
                let choosedAns = ['']
                if (confirmData !== 0) {
                    localInitialValue = localStore[index].initialValue;
                    choosedAns = localStore[index].choosedAns;
                }
                console.log(oneObj);
                return {
                    ...oneObj,
                    choosedAns: choosedAns,
                    initialValue: localInitialValue
                }
            }) : []
            setAnsArray(ansArray);
        }
        get();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    ///-----------*************************End Use Effects

    ///----------- Handlers
    const onSubmit = () => {
        let res = window.confirm("Do you really want to Submit the Test?");
        if (res !== true)
            return;
        const check = (oneObj) => {
            let correctAns = Array.isArray(oneObj.correctOptionIndex) === true ? oneObj.correctOptionIndex : [oneObj.correctOptionIndex];
            let choosedAns = oneObj.choosedAns.join('');
            let toCorrectAns = correctAns.join('');//  
            if (choosedAns === toCorrectAns) {
                c++;
            }
            else
                if (choosedAns === '')
                    w++;
                else {
                    w++;
                }
        }
        ansArray.forEach(check);

        navigate('../finish', {
            state: {
                testName: test ? test.name : '',
                noQ: test.questions.length,
                correct: c,
                wrong: w
            }
        })
        c = 0;
        w = 0;
        localStorage.setItem('selected', JSON.stringify(Array(test.questions.length).fill({})));
        localStorage.setItem('currentpage', 1);
    }

    const onSelect = (AnsArray, QIndex, AnsIndex, type) => {
        if (type === "radio") {
            let newAnsIndex = [AnsIndex]
            let newOption = AnsArray.initialValue.map(() => false)
            newOption[AnsIndex] = !newOption[AnsIndex]
            AnsArray.choosedAns = newAnsIndex;
            AnsArray.initialValue = newOption
            //sets local Storage Code
            let localStore = JSON.parse(localStorage.getItem('selected'))
            localStore[QIndex] = {
                qindex: QIndex,
                initialValue: AnsArray.initialValue,
                choosedAns: AnsArray.choosedAns
            }
            localStorage.setItem('selected', JSON.stringify(localStore));

            //setting state
            ansArray[QIndex] = AnsArray;
            setAnsArray([...ansArray])
        }
        else {
            let newOption = [...AnsArray.initialValue]
            newOption[AnsIndex] = !newOption[AnsIndex];
            let newAnsIndex = newOption.map((oneAns, index) => {
                if (oneAns === true)
                    return index;
                return -1;
            }).filter(one => one !== -1).sort();

            AnsArray.choosedAns = newAnsIndex;
            AnsArray.initialValue = newOption;
            //sets local Storage
            let localStore = JSON.parse(localStorage.getItem('selected'))
            localStore[QIndex] = {
                qindex: QIndex,
                initialValue: AnsArray.initialValue,
                choosedAns: AnsArray.choosedAns
            }
            localStorage.setItem('selected', JSON.stringify(localStore));
            //setting state
            ansArray[QIndex] = AnsArray;
            setAnsArray([...ansArray])
        }
    }

    const getOptions = (type, question, qindex) => {
        let optionsList = question.options.map((oneOption, oindex) => {
            return (
                <div className={type} key={oindex}>
                    <label key={oindex}>
                        <input
                            id={oindex}
                            type={type}
                            name={type === 'radio' ? 'option' : `op${oindex}`}
                            value={oneOption}
                            checked={question.initialValue[oindex]}
                            onChange={() => onSelect(question, qindex, oindex, type)}
                        />{oneOption}
                    </label>
                </div>
            )
        })
        return optionsList
    }

    const renderData = (question, qindex) => {
        if (question) {
            let type = question[0].type ? 'checkbox' : 'radio';
            let optionsList = getOptions(type, question[0], qindex)
            return (
                <form>
                    <label>{question[0].questionText}</label>
                    {optionsList}
                </form>
            )
        }
    }
    localStorage.setItem('currentpage', currentPage);

    return (
        <>
            <div className="container">
                <div className="row">
                    <h1>My Interview Portal</h1>
                    <hr />
                    <div className="col-md-12">
                        <div className="panel panel-default">
                            <div className="panel-heading">{test ? test.name : ''}</div>
                            <div className="panel-body">
                                {
                                    renderData(currentItem, indexOfFirstItem)
                                }
                            </div>
                            <div className="panel-footer">
                                <span>
                                    <button className="btn btn-success"
                                        style={{ marginRight: "1rem" }}
                                        onClick={handlePrev}
                                        disabled={currentPage === pages[0] ? true : false}
                                    >
                                        Prev
                                    </button>
                                    <button
                                        className="btn btn-success"
                                        onClick={handleNext}
                                        disabled={currentPage === pages[pages.length - 1] ? true : false}
                                    >
                                        Next
                                    </button>
                                </span>
                                <button className="pull-right btn btn-danger" onClick={() => onSubmit()}>Finish</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Test