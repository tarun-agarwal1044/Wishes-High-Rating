import React, { useState, useEffect } from 'react'
import axios from 'axios';

function Rate() {

    const [userData, setUserData] = useState(null);
    const [handle, setHandle] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [dataSet, toogleSet] = useState(false);
    const [todoQues, setTodoQues] = useState({
        name: '',
        contestId: ''
    });
    const [removeQues, setRemoveQues] = useState({
        name: '',
        contestId: ''
    });
    //const [lo, setLogout] = useState(false);
    const [toDoList, setToDoList] = useState(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(event) {
        setLoading(true);
        event.preventDefault();
        var res = await callData(userName, password, handle);
        setLoading(false);
        // console.log(res);

        // sessionStorage.setItem("userD", JSON.stringify(res.userD));
        // sessionStorage.setItem("handle", res.handle);
        // setUserData(res.userD);
        // setHandle(res.handle);
        // toogleSet(true);
    }

    function callData(userName, password, handle) {
        let data = {
            userName,
            password,
            handle
        }
        // var res = null;
        var res = axios.post("http://localhost:5000/nrating", data).then(response => {
            res = {
                userD: (response.data),
                userName: userName
            };
        }).then(() => {
            sessionStorage.setItem("userD", JSON.stringify(res.userD));
            sessionStorage.setItem("userName", res.userName);
            setUserData(res.userD);
            setUserName(res.userName);
            toogleSet(true);
        })
        // console.log(res);
        return res;
    }

    useEffect(async () => {
        let quesData = {
            name: todoQues.name,
            contestId: todoQues.contestId,
            userName: userName
        }
        if (quesData.name !== '') {
            axios.post("http://localhost:5000/list", quesData).then(async (res) => {
                // response = res;
                console.log("todolistttttt     \n" + res);
                await callData(userName, password, handle);
                setLoading(false);
                setToDoList(res.data);

                // console.log("todolist "+ toDoList);
            })

        }
        // setLoading(false);
    }, [todoQues])

    useEffect(() => {
        if (window.sessionStorage.getItem('userD')) {
            setUserData(JSON.parse(window.sessionStorage.getItem('userD')));
            setUserName(window.sessionStorage.getItem('userName'));
        }
    }, []);

    useEffect(() => {
        if (userData) {
            let quesData = {
                name: "",
                contestId: "",
                userName : userName
            }
            axios.post("http://localhost:5000/list", quesData).then(response => {
                setToDoList(response.data);
            }).then(() => {
                toogleSet(true);
            })
        };
    }, [userData]);

    useEffect(() => {
        let quesData = {
            name: removeQues.name,
            contestId: removeQues.contestId,
            userName: userName
        }
        if (quesData.contestId !== '') {
            axios.post("http://localhost:5000/uwlist", quesData).then(async response => {
                await callData(userName, password, handle);
                setLoading(false);
                setToDoList(response.data);
            })
        }
    }, [removeQues]);
    function abc(event) {
        setTodoQues({
            name: document.getElementById(event.target.id).id,
            contestId: document.getElementById(event.target.id).value
        });
        return null;
    }

    async function onclick(event) {
        setLoading(true);
        event.preventDefault();
        setTodoQues({
            name: document.getElementById(event.target.id).id,
            contestId: document.getElementById(event.target.id).value
        });
        // setLoading(false);
        // var temp = await abc(event);
        // console.log(toDoList);
        // var res = await callData(userName, password, handle);

        // document.getElementById(event.target.id).disabled = true;
        // document.getElementById(event.target.value).disabled = true;
    }

    function handleclick(event) {
        setLoading(true);
        event.preventDefault();
        if (document.getElementById(event.target.id) === null)
            return;
        setRemoveQues({
            name: document.getElementById(event.target.id).value,
            contestId: document.getElementById(event.target.id).id
        });
        // setLoading(false);
        // if (document.getElementById(event.target.id) !== null) {
        //     document.getElementById(event.target.id).disabled = true
        // }

        // if (document.getElementById(event.target.value) !== null) {
        //     document.getElementById(event.target.value).disabled = true
        // }
    }

    function show(e, index) {
        return (<div key={index.toString()}><a href={"https://codeforces.com/problemset/problem/" + e.contestId + "/" + e.index}>
            <h2 className="h22">{e.contestId + e.index} {e.name}</h2>
        </a>
            <button className="buttonclass" id={e.name} value={e.contestId + e.index} onClick={onclick}>ADD</button>
            <button className="buttonclass" id={e.contestId + e.index} value={e.name} onClick={handleclick}>REMOVE</button>
        </div>);
    }

    function logout() {
        //setLogout(true);
        sessionStorage.clear();
        setUserData(null);
        setUserName('');
        toogleSet(false);
        //setLogout(false);
    }
    function contest(contestId) {
        //return "hello";
        var n = contestId.length;
        var str1 = '', str2 = '', i;
        for (i = 0; i < n; i++) {
            if (contestId[i] >= 0 && contestId[i] <= 9)
                str1 += contestId[i];
            else
                break;
        }
        for (; i < n; i++)
            str2 += contestId[i];

        return str1 + '/' + str2;

    }

    function showToDoList(event, index) {
        return (<div key={index.toString()}>
            <a href={"https://codeforces.com/problemset/problem/" + contest(event.contestId)}>
                <h2 className="h22">{event.contestId} {event.name}</h2>
            </a>
            <button className="buttonclass" id={event.contestId} value={event.name} onClick={handleclick}>REMOVE</button>
        </div>)
    }

    return (
        <div>
            {loading ? <div className="loading" /> : null}
            {!dataSet ?
                <form onSubmit={onSubmit} className="container">
                    <label>User Name</label>
                    <input className="in" id="UserName" type="text" name="userName" spellCheck="false" onChange={(e) => {
                        setUserName(e.target.value);
                    }} />
                    <label>Password</label>
                    <input className="in" id="Password" type="password" name="password" onChange={(e) => {
                        setPassword(e.target.value);
                    }} />
                    <label>User Handle</label>
                    <input className="in" id="Handle" type="text" name="userHandle" spellCheck="false" onChange={(e) => {
                        setHandle(e.target.value);
                    }} />
                    <button className="buttonclass" type="submit" className="submit">Go</button>
                </form> :
                <div>

                    <div className="row">
                        <h1 className="column" id="h11">User Rating: {userData.rating>0 ? userData.rating : "NA"}</h1>
                        <button id="buttonclass" className="column" onClick={logout} >Logout</button>
                    </div>

                    {userData.rating >= 0 ?

                        <div className="row">
                            {loading ? <div className="loading" /> : null}
                            {userData.ques == 0 ?
                                <h1 className="h11">You Have not solved any question Yet</h1>
                                : <div>
                                    <div className="column">
                                        <h1 className="h11">Questions: </h1>
                                        {userData.ques.map(show)}
                                    </div>
                                    <div className="column">
                                        <h1 className="h11">To Do List</h1>
                                        {toDoList ==null ? null : toDoList.map(showToDoList)}
                                    </div>
                                </div>


                            }

                        </div>
                        : <div> {userData.rating == -1 ? <h2 className="h22">Please Enter Valid Handle</h2> : <h2 className="h22">User Name Already Exist...... Enter correct details for this user name or create a new Account</h2>}</div>
                    }
                </div>
            }
        </div>
    );
}

export default Rate;