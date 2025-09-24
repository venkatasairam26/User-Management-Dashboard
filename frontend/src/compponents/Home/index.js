import './index.css';
import Navbar from '../navbar';
import { useState, useEffect } from 'react';
import { Spinner } from "@fabioliberto/loading-spinner";
import UserItems from '../UserItems';

const apiStatusConstants = {
    initial: "INITIAL",
    success: "SUCCESS",
    failure: "FAILURE",
    inProgress: "IN_PROGRESS"
}
const Home = () => {
    const [apiResponse, setApiResponse] = useState({apiStatus: apiStatusConstants.initial, data: null, error_message: null});
    const [addUser, setAddUser] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    



    const handleAddUser = () => {
        setAddUser(!addUser);
    }

    const handleAddUserSubmit = async (event) => {
        event.preventDefault();
        const data = {
            first_name:firstName,
            last_name:lastName,
            email,
            department
        }

       const response = await fetch("https://user-management-dashboard-aaj0.onrender.com/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
       })
       const responseData = await response.json();
       if(response.ok){
        setError("User added successfully");
        setTimeout(() => {
            setAddUser(!addUser);
            setFirstName("");
        setLastName("");
        setEmail("");
        setDepartment("");
        setError("");
        getUserData();
        }, 2000);
        
       }else{
        setError(responseData.message);
       }
       
    }
   
    useEffect(() => {
        getUserData();
    }, [search,filter]);



    const getUserData = async () => {
        setApiResponse({apiStatus: apiStatusConstants.inProgress, data: null, error_message: null});
        console.log(filter);
        try {
            const response = await fetch(`https://user-management-dashboard-aaj0.onrender.com/users?search=${search}&filter=${filter}`);
            const data = await response.json();
            const userData = data.map(each =>{
                return {
                    id: each.id,
                    firstName: each.first_name,
                    lastName: each.last_name,
                    email: each.email,
                    department: each.department
                }
            });
            setApiResponse({apiStatus: apiStatusConstants.success, data: userData, error_message: null});
        } catch (error) {
            setApiResponse({apiStatus: apiStatusConstants.failure, data: null, error_message: error});
        }

    }

    const renderView = () => {
        const {apiStatus, data} = apiResponse;
        switch(apiStatus){
            case apiStatusConstants.initial:
                return <p>Initial</p>
            case apiStatusConstants.success: 
                return <div className="user-data">
                    {addUser && <div className="add-user">
                        <h2>Add User</h2>
                        <form onSubmit={handleAddUserSubmit}>
                            <input type="text" placeholder="First Name" required onChange={(e) => setFirstName(e.target.value)} />
                            <input type="text" placeholder="Last Name" required onChange={(e) => setLastName(e.target.value)} />
                            <input type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
                            <input type="text" placeholder="Department" required onChange={(e) => setDepartment(e.target.value)} />
                           <p className="error">{error}</p>
                            <button type="submit">Add User</button>
                        </form>
                    </div>}
                    {data.length === 0 ? <p className="no-data">No data found</p> :<ul>
                        <li className="user-details">User Details</li>
                        <li className="user-item">
                            <p>First Name</p>
                            <p>Last Name</p>
                            <p className="email">Email</p>
                            <p>Department</p>
                          
                        </li>
                        {data.map((item) =>(<UserItems key={item.id} userDetails={item} reload={getUserData}/>))}
                        </ul>}
                </div>
            case apiStatusConstants.failure:
                return <p>Failure</p>
            case apiStatusConstants.inProgress:
                return <div style={{ minHeight: 120, display: "grid", placeItems: "center" }}>
                <Spinner size="lg" color="#7c3aed" />
              </div>
            default:
                return null
        }
    }


    return (
        <div className="home">
            <Navbar handleAddUser={handleAddUser}
             search={search} 
             setSearch={setSearch} 
             filter={filter} 
             setFilter={setFilter}/>
            {renderView()}
        </div>
    );
};

export default Home;
