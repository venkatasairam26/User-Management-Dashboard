import './index.css';
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const UserItems = (props) => {
    const {userDetails, reload} = props;
    const {firstName, lastName, email, department} = userDetails;
    const handleEdit = () => {
        console.log("Edit");
    }
    const handleDelete = async () => {
        const response = await fetch(`https://user-management-dashboard-aaj0.onrender.com/users?email=${email}`, {
            method: "DELETE"
        })
        const data = await response.json();
        console.log(data);
        reload();
    }
    return (
        <div className="user-items">
            <p >{firstName}</p>
            <p >{lastName}</p>
            <p className="email">{email}</p>
            <p>{department}</p>
            <button onClick={handleEdit}><MdModeEdit className="icon"/></button>
            <button onClick={handleDelete}><MdDelete className="icon"/></button>
        </div>
    );
};

export default UserItems;
