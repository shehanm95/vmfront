import * as React from 'react';
import { AxiosResponse } from 'axios';
import { request, setAuthHeader } from '../helpers/axios_helper';

interface AuthContentState {
    data: (string | number)[];
}

export default class AuthContent extends React.Component<{}, AuthContentState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            data: [],
        };
    }

    componentDidMount(): void {
        request('GET', '/messages', {})
            .then((response: AxiosResponse<any>) => { // Use 'any' for flexibility
                this.setState({ data: response.data });
            })
            .catch((error: any) => {
                if (error.response && error.response.status === 401) {
                    setAuthHeader(null);
                } else if (error.response) {
                    if (Array.isArray(error.response.data)) {
                        this.setState({ data: error.response.data });
                    } else if (error.response.data && error.response.data.code) {
                        this.setState({ data: [error.response.data.code] });
                    } else {
                        this.setState({ data: ["email or password wrong.."] });
                    }
                } else {
                    this.setState({ data: ["Network error or backend is down."] });
                }
            });
    }

    render() {
        return (
            <div className="row justify-content-md-center">
                <div className="col-4">
                    <div className="card" style={{ width: '18rem' }}>
                        <div className="card-body">
                            <h5 className="card-title">Backend response</h5>
                            <p className="card-text">Content:</p>
                            <ul>
                                {this.state.data.map((line, index) => (
                                    <li key={index}>{line}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}