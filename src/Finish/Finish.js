import React from 'react'
import { useLocation } from 'react-router-dom'

const Finish = () => {
    let location = useLocation();
    const { testName, noQ, correct, wrong } = location.state;
    return (
        <div className="container">
            <div className="row">
                <h1>My Interview Portal</h1>
                <hr />
                <div className="col-md-12">
                    <div className="panel panel-default">
                        <div className="panel-heading">{testName} - Result</div>
                        <div className="panel-body">
                            <center>
                                <h2 className="">Total no of Questions: {noQ}</h2>
                                <h3 className="text-success">Correct Answers: {correct}
                                    <span className="text-danger">Wrong Answers: {wrong}</span></h3>
                            </center>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Finish
