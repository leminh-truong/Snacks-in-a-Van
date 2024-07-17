import "../styles/Loading.scss";

function Loading() {
    return (
        <div id="container">
            <div id="surround">
                <div className="clouds" />

                <img id="van" alt="The Snacks Van" src="/VanIcon.svg" />
                <div id="bottom" />
            </div>
        </div>
    )
}

export default Loading;