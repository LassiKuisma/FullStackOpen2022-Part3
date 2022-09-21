const Notification = ({ notification }) => {
    if (notification === null || notification === undefined) {
        return null
    }

    let className = "error";
    if (notification.type === "green") {
        className = "ok"
    } else if (notification.type === "yellow") {
        className = "alert"
    }

    return (
        <div className={className}>
            {notification.message}
        </div>
    )
}

export default Notification
