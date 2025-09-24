import './index.css';
const Navbar = (props) => {
    const {handleAddUser, search, setSearch, filter, setFilter} = props;

    

    return (
        <div className="header">
            <h1>User Management Dashboard</h1>
            <nav className="navbar">
                <div className="search-add-user">
                    <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                    <button onClick={handleAddUser}>Add User</button>
                </div>
                <select onChange={(e) => setFilter(e.target.value)} value={filter} className="filter">
                    <option value="all">All</option>
                    <option value="first_name">first Name</option>
                    <option value="last_name">last Name</option>
                    <option value="email">email</option>
                    <option value="department">department</option>
                </select>
            </nav>
        </div>
    );
};

export default Navbar;
