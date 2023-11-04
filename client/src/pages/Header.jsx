import '../styles/Header.css';
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Header() {
    return (
        <nav className="navbar navbar-expand-lg header-nav fixed-top pt-0">
            <div className="container-fluid">
                <a className="navbar-brand fw-bold fs-3" href="/">Homomorphic Encryption</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <NavLink className="nav-link" activeclassname="active" to="/additiondemo">
                                Addition Demo
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" activeclassname="active" to="/votingsystem">
                                Voting System
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" activeclassname="active" to="/votingtally">
                                Voting Tally
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
