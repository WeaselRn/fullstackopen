const PersonForm = ({
    onSubmit,
    nameValue,
    numberValue,
    onNameChange,
    onNumberChange
}) => {
    return (
        <form onSubmit={onSubmit}>
            <div>
                name: <input value={nameValue} onChange={onNameChange} />
            </div>
            <div>
                number: <input value={numberValue} onChange={onNumberChange} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm
