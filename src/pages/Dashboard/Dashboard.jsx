import { Component } from 'react';

export default class Dashboard extends Component {
    render() {
        return (
            <>
                <div className="container-fluid p-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h3 className='mb-3'>Dashboard</h3>
                            <div className="card border-0 shadow-sm">
                                <div className="card-body rounded welcome-dashboard">
                                    <p className='m-0'>You Have Log In, Welcome to Dashboard Warung Makan Bakari</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}