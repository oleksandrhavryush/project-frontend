let accountsCount = 0;
let currentPageNumber = 0;
let accountsPerPage = 3;


$(function () {
    updateAccountsTable()
    updateAccountsCount()
    createAccountPerPageDropDown()
});

function updateAccountsTable() {

    $.get(`http://localhost:8080/rest/players?pageNumber=${currentPageNumber}&pageSize=${accountsPerPage}`, (accounts) => {
        const $tableBody = document.querySelector('.accounts-table-body');

        $tableBody.innerHTML = '';
        accounts.forEach(account => {
            $tableBody.insertAdjacentHTML('beforeend', createTableRow(account))
        })
    })
}

function createSelectOptions(numbers, defaultValue) {
    return numbers.map(num =>
        `<option ${num === defaultValue ? 'selected' : ''} value="${num}">${num}</option>`
    ).join('');
}

function createAccountPerPageDropDown() {
    const $dropDown = document.querySelector('#accounts-per-page');
    const options = createSelectOptions([3, 5, 10, 20], accountsPerPage)
    $dropDown.addEventListener('change', onAccountsPerPageChangeHandler)
    $dropDown.insertAdjacentHTML('afterbegin', options)
}

function updatePaginationButtons() {
    const buttonCount = accountsCount ? Math.ceil(accountsCount / accountsPerPage) : 0;
    const $paginationButtons = document.querySelector('.pagination-buttons');

    $paginationButtons.innerHTML = '';
    let paginationButtonsHtml = '';

    for (let i = 1; i < buttonCount; i++) {
        paginationButtonsHtml += `<button value="${i - 1}">${i}</button>`
    }

    $paginationButtons.insertAdjacentHTML('beforeend', paginationButtonsHtml);

    Array.from($paginationButtons.children).forEach(button => button.addEventListener('click', paginationButtonHandler))
}

function updateAccountsCount() {
    $.get(`http://localhost:8080/rest/players/count`, (count) => {
        accountsCount = count;
        updatePaginationButtons()
    })
}

function paginationButtonHandler(e) {
    currentPageNumber = e.target.value;
    updateAccountsTable();
}

function onAccountsPerPageChangeHandler(e) {
    accountsPerPage = e.target.value;
    updateAccountsTable();
    updatePaginationButtons();
}

function createTableRow(account) {
    return `<tr class="row">
                <td>${account.id}</td>
                <td>${account.name}</td>
                <td>${account.title}</td>
                <td>${account.race}</td>
                <td>${account.profession}</td>
                <td>${account.level}</td>
                <td>${account.birthday}</td>
                <td>${account.banned}</td>
            </tr>`;
}

function deleteAccount(id) {
    $.delete(`http://localhost:8080/rest/players/${id}`, () => updateAccountsTable())
}
