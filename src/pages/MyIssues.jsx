import { useEffect, useState } from "react";
import api from "../services/api";

function MyIssues() {

    console.log("MyIssues page loaded");

    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const fetchIssues = async () => {

            try {

                const response = await api.get("/issues");

                console.log("API Response:", response.data);


                // Handles both response formats
                const allIssues = response.data.issues || response.data;

                console.log("All Issues:", allIssues);


                const user = JSON.parse(
                    localStorage.getItem("user")
                );

                console.log("Logged User:", user);


                if (!user) {
                    console.log("User not found");
                    return;
                }


                const myIssues = allIssues.filter(
                    (issue) => {

                        const reportedBy = issue.reportedBy;

                        return (
                            reportedBy?.toString() === user.id ||
                            reportedBy?._id?.toString() === user.id
                        );

                    }
                );


                console.log("Filtered My Issues:", myIssues);


                setIssues(myIssues);


            } catch(error) {

                console.log(
                    "Error fetching issues:",
                    error
                );

            }
            finally {

                setLoading(false);

            }

        };


        fetchIssues();


    }, []);



    if(loading){

        return (
            <h2>
                Loading complaints...
            </h2>
        );

    }



    return (

        <div className="my-issues-container">

            <h1>
                My Complaints
            </h1>


            {
                issues.length === 0 ?

                (

                    <h3>
                        No complaints reported yet
                    </h3>

                )

                :

                (

                    issues.map((issue)=>(

                        <div
                            className="issue-card"
                            key={issue._id}
                        >

                            <h2>
                                {issue.title}
                            </h2>


                            <p>
                                <b>Category:</b> {issue.category}
                            </p>


                            <p>
                                <b>Priority:</b> {issue.priority || "Not assigned"}
                            </p>


                            <p>
                                <b>Status:</b> {issue.status}
                            </p>


                            <p>
                                {issue.description}
                            </p>


                        </div>

                    ))

                )
            }


        </div>

    );

}


export default MyIssues;