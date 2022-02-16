import React, { useContext, useEffect, useState } from 'react'
// import { NavLink } from 'react-router-dom';
import '../Todo/todostyle.css';
import Done from './Done';
import Assigned from "./Assigned";
import Missing from './Missing';
import AuthContext from "../../AuthContext";
import { G_API, API } from "../../config";
import { useHistory } from 'react-router';
import Form1 from '../Assignments/form1';



const TodoList = () => {
    const history  = useHistory();
    const [todo, Settodo] = useState("1");
    const [courses, setCourses] = useState([]);
    const [Assign, setAssign] = useState([]);
    const [dated, setDated] = useState([]);
    const [miss, setmiss] = useState([]);
    const { userData, setUserData, setOpen, setMessage } = useContext(
        AuthContext
    );


    console.log(todo);
    let dates = [];
    let assign = [];
    let missing = [];

    useEffect(() => {
        if (userData.token) {
            setUserData((u) => ({ ...u, loader: u.loader + 1 }));
            const data = fetch(`${G_API}/courses?courseStates=ACTIVE`, {  // fetch active courses for a user and store it inside courses 
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userData.token}`,
                },
            })
                .then((res) => res.json())
                .then((res) => {
                    setUserData((u) => ({ ...u, loader: u.loader - 1 }));
                    setCourses(res.courses);
                    let len = res.courses.length;
                    for (let qal = 0; qal < len; qal++) {
                        fetch(`${API}/api/assignment?course_id=${res.courses[qal].id}`, { //add the assignments using backend assignment module (the field of status is added by default)
                            method: "GET",
                        })
                            .then((r) => r.json())
                            .then((r) => {
                                setAssign((prev) => {
                                    //console.log(prev?.length,r?.length)
                                    return [...prev, ...r]
                                })
                            });
                    }
                });
        }
    }, [userData.token], [courses.id]);

    //  console.log(Assign);

    function Deadlines() {
        dates = [];
        for (let x = 0; x < Assign.length; x++) {
            const string4 = new String(Assign[x].reviewer_deadline);
            // console.log(string4.substring(0,10));
            var d = (string4.substring(0, 4)).concat(string4.substring(5, 7));
            var d1 = d.concat(string4.substring(8, 10))
            let d2 = parseInt(d1);
            // console.log(d2);
            dates.push(d2);
        }
        setDated(dates)

    }
    useEffect(() => {
        Deadlines();
    }, [Assign])

    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];



    function chutney() {
        let date = new Date();
        let yy = date.getFullYear();
        let mm = date.getMonth();
        let cd = date.getDate();
        mm = mm + 1;
        //   console.log(yy ,mm , cd);
        assign = [];
        missing = [];
        for (let x = 0; x < Assign.length; x++) {
            const string4 = new String(Assign[x].reviewer_deadline);
            var ryy = string4.substring(0, 4);
            var rmm = string4.substring(5, 7);
            var rdd = string4.substring(8, 10);
            // console.log(ryy , rmm , rdd);
            if (ryy == yy) {
                if (rmm > mm) {
                    assign.push(Assign[x]);
                }
                else if (rmm < mm) {
                    missing.push(Assign[x]);
                }
                else {
                    if (rdd >= cd) {
                        // console.log(Assign[x]);
                        assign.push(Assign[x]);
                    }
                    else {
                        missing.push(Assign[x]);
                    }
                }

            }

            else if (ryy > yy)
                assign.push(Assign[x]);

            else
                missing.push(Assign[x]);

        }
             setmiss(missing);
        // console.log(miss);

    }
    useEffect(() => {
        chutney();
    }, [Assign])

// console.log(miss);
const f1 = () => {
    Settodo(1);
    // history.push("/TodoList");
  }
  const f2 = () => {
    Settodo(2);
    // history.push("/Missing");
  }
  const f3 = () => {
    Settodo(3);
    // history.push("/Done");
  }

    return (
        <>
            <div className="list">
                <button activeClassName='menu_active' className="nav-link anchorlink" onClick={f1}>Assigned</button>
                <button activeClassName='menu_active' className="nav-link anchorlink" onClick={f2}>Missing</button>
                <button activeClassName='menu_active' className="nav-link anchorlink" onClick={f3}>Done</button>
            </div>
          
             {
                todo === "1" ? <div><Assigned AA = {miss} /></div>
                    : todo === "2" ? <div>hhhhhh</div>
                        : todo === "3" ? <div>hjhjghdfg</div>
                            : null
            } 
           
        </>
    )
}
export default TodoList;