import React from "react";
import "./App.css";
import LoadingScreen from "./LoadingScreen";
import RenderVideo from "./RenderVideo";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 1: far
            // 2: near
            // 3: very near
            vibrateStatus: 1,
            loading: true,
        };
    }

    videoRef = React.createRef();
    canvasRef = React.createRef();

    demoAsyncCall = () => {
        return new Promise((resolve) => setTimeout(() => resolve(), 2500));
    };

    componentDidMount() {
        this.demoAsyncCall().then(() => this.setState({ loading: false }));
    }
    render() {
        const { loading } = this.state;

        if (loading) {
            return <LoadingScreen />;
        } else {
            return <RenderVideo />;
        }
    }
}

export default App;
