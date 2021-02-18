import { auto } from "async";
import React from "react";
import logotext from "./argus_logotext_t.png";

class LoadingScreen extends React.Component {
    render() {
        return (
            <div
                style={{
                    width: "50vw",
                    height: "50vh",
                    display: "flex",
                    margin: "auto",
                    textAlign: "center",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <img
                    style={{
                        display: "flex",
                        margin: "auto",
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    src={logotext}
                    alt="logo"
                />
            </div>
        );
    }
}

export default LoadingScreen;
