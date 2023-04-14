// Category Forms
function categoryForm(url, method) {
    let holder = document.createElement('div')
    holder.innerHTML = `<div class="row">
                            <div class="col-sm-12">
                                <form action="${url}" method="${method}" enctype="multipart/form-data">
                                    <label class="d-flex flex-column align-items-center mb-3">
                                        <img src="/IMAGES/img.svg" alt="" class="img-fluid img-thumbnail curp rounded rounded-circle ob-fit-square" width="150" id="category-prev-img">
                                        <small>Click to Upload</small>
                                        <input type="file" class="d-none" name="image" id="prev-file-image" accept="image/*">
                                    </label>
                                    <div class="form-group text-left">
                                        <label class="d-block">
                                            Category Name:
                                            <input type="text" name="category_name" class="form-control mt-1">
                                        </label>
                                    </div>
                                    <div class="form-group text-left">
                                        <label class="d-block">
                                            Category Description:
                                            <textarea type="text" name="category_desc" class="form-control" mt-1 id="elm1" maxlength="400"></textarea>
                                        </label>
                                    </div>
                                    <input type="submit" value="Add" class="w-100 d-block btn btn-sm btn-success">
                                </form>
                            </div>
                        </div>`;
    return holder
}

function getRoles(userData, user) {
    let holder = document.createElement('div')
    holder.innerHTML = `
        <form action="/${userRole}/user/roles/${userData}" method="POST">
        <div class="form-group p-3">
        <label>
        <img src="${user.image}" class="ob-fit-square img-fluid rounded rounded-circle" width="100">
        </label>
        <h4 class="mb-3">${user.fullname}</h4>
        <label class="d-block text-left">
            Set Role
            <select type="text" class="form-control">
                <option value="user" >User</option>
                <option value="vendor" >Vendor</option>
                <option value="vendor" >Manager</option>
            </select>
        </label>
        <input type="submit" value="Update" class="btn btn-sm btn-success w-100">
        </div>
        </form>
    `
    return holder
}

function getUserStatus(userData, user) {
    let holder = document.createElement('div')
    holder.innerHTML = `
        <form action="/${userRole}/user/status/${userData}" method="POST">
        <div class="form-group p-3">
        <h4 class="text-capitilize">Set ${user.NAME.split(' ')[0]} Status</h4>
        <label class="d-block text-left">
            Set Role
            <input type="hidden" value="${user.USER_ID}" name="userid">
            <select type="text" class="form-control" name="status">
                <option value="active" >Active</option>
                <option value="inactivate" >Deactivate</option>
            </select>
        </label>
        <input type="submit" value="Update" class="btn btn-sm btn-success w-100">
        </div>
        </form>
    `
    return holder
}



function addVendorHtml() {
    let holder = document.createElement('div')

    holder.innerHTML = `
        <form action="/${userRole}/user/vendor/create" method="post">
  <div class="form-group text-left">
    <label>Vendor Name:</label>
    <input type="text" name="vendor_name" class="form-control" id="">
  </div> 
  <div class="form-group text-left">
    <label>Vendor Email:</label>
    <input type="text" name="vendor_email" class="form-control" id="">
  </div>
  <div class="form-group text-left">
    <label>Vendor Password:</label>
    <input type="text" name="vendor_password" class="form-control" id="">
  </div>
  <input type="submit" class="btn btn-sm btn-success" value="Add Vendor">
</form>
    `

    return holder
}


function editCardHTML(cardID) {
    let holder = document.createElement('div')
    holder.innerHTML = `<form action="/user/update/cards?card=${cardID}" method="post">
            <input type="text" class="form-control mb-2" name="cardName" placeholder="Name on card">
                
            <input type="text" class="form-control mb-2" name="cardNumber" placeholder="**** **** **** **** ***">
            <input type="tel" class="form-control mb-2" name="cardMonth" placeholder="card expiry month">
            <input type="tel" class="form-control mb-2" name="cardYear" placeholder="card expiry year">
            <input type="tel" class="form-control mb-2" name="cardCVV" placeholder="card cvv">

            <input type="submit" class="btn btn-sm btn-success" value="Update Card">
            </form>`

    return holder
}



function newTeamForm(url, method) {
    let holder = document.createElement('div')
    holder.innerHTML = `<div class="row">
                            <div class="col-sm-12">
                                <form action="${url}" method="${method}" enctype="multipart/form-data">
                                    <label class="d-flex flex-column align-items-center mb-3">
                                        <img src="/IMAGES/image.png" alt="" class="img-fluid img-thumbnail curp rounded rounded-circle ob-fit-square" width="150" id="category-prev-img">
                                        <small>Click to Upload</small>
                                        <input type="file" class="d-none" name="image" id="prev-file-image" accept="image/*">
                                    </label>
                                    <div class="form-group text-left">
                                        <label class="d-block">
                                            Name:
                                            <input type="text" name="team_name" class="form-control mt-1">
                                        </label>
                                    </div>
                                    <div class="form-group text-left">
                                        <label class="d-block">
                                            Role:
                                            <input type="text" name="team_role" class="form-control" >
                                        </label>
                                    </div>
                                    <input type="submit" value="Add New Member" class="w-100 d-block btn btn-sm btn-success">
                                </form>
                            </div>
                        </div>`;
    return holder
}