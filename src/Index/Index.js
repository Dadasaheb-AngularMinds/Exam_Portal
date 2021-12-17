import React, { useState, useEffect } from 'react'
import { getAllTestID } from '../service/service'
import { useNavigate } from 'react-router';



const Index = () => {
    //routing
    let navigate = useNavigate();

    //////--------Use States
    //get All Data
    const [tests, setTests] = useState(null);
    //For List
    const [list, setList] = useState([]);



    ///------- Service Functions

    const clickHandler = (index) => {
        localStorage.setItem('selected', JSON.stringify(Array(tests[index].questions.length).fill({})));
        localStorage.setItem('currentpage', 1);
        navigate(`../test`,{ state: { index } });
    }


    ////-------------- Use Effects
    useEffect(() => {
        const getTestsArray = async () => {
            const response = await getAllTestID();
            setTests(response);
            // console.log(response);
        }
        
        getTestsArray();
    }, [])


    useEffect( () =>{

    })

    useEffect(() => {
        if (tests !== null) {
            // console.log(tests[0]);
            const allList = tests.map(({ _id, name, questions }, index) => {
                return (
                    <tr key={_id}>
                        <td>{name}</td>
                        <td>{questions.length}</td>
                        <td><button className="btn btn-warning" onClick={() => clickHandler(index)}>Start Test</button></td>
                    </tr>
                )
            })
            setList(allList);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tests])


    return (
        <div className="container">
            <div className="row">
                <h1>My Interview Portal</h1>
                <hr />
                <div className="col-md-12">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Test</th>
                                <th>No of Questions</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {list}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Index
