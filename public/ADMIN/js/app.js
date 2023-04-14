/**
 * Theme: Metrica -
 * Author: Mannatthemes
 * Module/App: Main Js
 */

(function ($) {
    "use strict";

    function initSlimscroll() {
        $(".slimscroll").slimscroll({
            height: "auto",
            position: "right",
            size: "7px",
            color: "#ebf0f6",
            wheelStep: 5,
            opacity: 1,
            touchScrollStep: 50,
        });
    }

    function initEnlarge() {
        if ($(window).width() < 1025) {
            $("body").addClass("enlarge-menu");
        } else {
            if ($("body").data("keep-enlarged") != true)
                $("body").removeClass("enlarge-menu");
        }
    }

    function initMainIconMenu() {
        $(".navigation-menu a").each(function () {
            var pageUrl = window.location.href.split(/[?#]/)[0];
            if (this.href == pageUrl) {
                $(this).parent().addClass("active"); // add active to li of the current link
                $(this).parent().parent().parent().addClass("active"); // add active class to an anchor
                $(this).parent().parent().parent().parent().parent().addClass("active"); // add active class to an anchor
            }
        });
    }

    function initTopbarMenu() {
        $(".navbar-toggle").on("click", function (event) {
            $(this).toggleClass("open");
            $("#navigation").slideToggle(400);
        });

        $(".navigation-menu>li").slice(-2).addClass("last-elements");

        $('.navigation-menu li.has-submenu a[href="#"]').on("click", function (e) {
            if ($(window).width() < 992) {
                e.preventDefault();
                $(this)
                    .parent("li")
                    .toggleClass("open")
                    .find(".submenu:first")
                    .toggleClass("open");
            }
        });
    }

    function init() {
        initSlimscroll();
        initEnlarge();
        initMainIconMenu();
        initTopbarMenu();
        Waves.init();
    }

    init();
})(jQuery);

// Get all option buttons and bind a click event listener to each one
document.querySelectorAll(".variation .option").forEach(function (option) {
    option.addEventListener("click", function () {
        // Remove active class from all siblings
        this.parentNode.querySelectorAll(".option").forEach(function (sibling) {
            sibling.classList.remove("active");
        });
        // Add active class to clicked button
        this.classList.add("active");
        // Update hidden input value
        var input = this.closest(".variation").querySelector(
            'input[type="hidden"]'
        );
        input.value = this.getAttribute("data-value");
    });
});

let previewFile = document.querySelectorAll("#preview-file");

previewFile.forEach((input) => {
    input.addEventListener("change", (e) => {
        let parent = input.closest("label");
        let image = parent.querySelector("img");
        let formerImage = image.src
        let uploaded = parent.querySelector(".upload");
        let url = URL.createObjectURL(input.files[0]);

        if (input.files[0].type !== "image/jpeg" && input.files[0].type !== "image/jpg") {
            swal({
                icon: "warning",
                text: "Image Format Not Supported, Accepted(JPEG, JPG)",
                button: {
                    className: "btn-success",
                },
            })
            return image.src = formerImage;
        }
        const maxSizeInBytes = 2 * 1024 * 1024;

        if (input.files[0].size > maxSizeInBytes) {
            swal({
                icon: "warning",
                text: "Image is large, Accepted (2mb max)",
                button: {
                    className: "btn-success",
                },
            })
            return image.src = formerImage;
        }

        image.src = url;

        const formData = new FormData();

        // Append the image file to the form data
        formData.append("image", input.files[0]);

        // Make a POST request using Axios
        axios
            .post(`/${userRole}/profile/image`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                    );
                    // progressBar.style.width = `${percent}%`;
                    const htmlUpload = document.createElement("div");
                    htmlUpload.innerHTML = `<div style="min-height:20vh;"> <div class="progress rounded-0 h-25px">
                    <div class="progress-bar progress-bar-succes progress-bar-striped activeProgress" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0"
                      aria-valuemax="100" style="width:${percent}%">
                      ${percent}%
                    </div>
                  </div></div>`;

                    swal({
                        title: "Uploading Your Image",
                        content: htmlUpload,
                        button: false,
                    });
                },
            })
            .then((response) => {
                if (response) {
                    swal({
                        icon: "success",
                        text: "Image Upload Successful",
                        button: {
                            className: "btn-success",
                        },
                    }).then(res => {
                        window.location.reload();
                    })
                }
            })
            .catch((error) => {
                console.error(error);
            });
    })
})

let prevFile = document.querySelectorAll("#prev-file");

prevFile.forEach((input) => {
    input.addEventListener("change", (e) => {
        let parent = input.closest("label");
        let image = parent.querySelector("img");
        let uploaded = parent.querySelector(".upload");
        let url = URL.createObjectURL(input.files[0]);
        image.src = url;

        if (input.files[0].type !== "image/jpeg" && input.files[0].type !== "image/jpg" && input.files[0].type !== "image/png") {
            swal({
                icon: "warning",
                text: "Image Format Not Supported, Accepted(JPEG, JPG, PNG)",
                button: {
                    className: "btn-success",
                },
            })
            return image.src = formerImage;
        }
        const maxSizeInBytes = 2 * 1024 * 1024;

        if (input.files[0].size > maxSizeInBytes) {
            swal({
                icon: "warning",
                text: "Image is large, Accepted (2mb max)",
                button: {
                    className: "btn-success",
                },
            })
            return image.src = formerImage;
        }
        // Create a new FormData instance
        const formData = new FormData();

        // Append the image file to the form data
        formData.append("image", input.files[0]);

        // Make a POST request using Axios
        axios
            .post(`/${userRole}/product/new`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                    );
                    // progressBar.style.width = `${percent}%`;
                    const htmlUpload = document.createElement("div");
                    htmlUpload.innerHTML = `<div style="min-height:20vh;"> <div class="progress rounded-0 h-25px">
                    <div class="progress-bar progress-bar-succes progress-bar-striped activeProgress" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0"
                      aria-valuemax="100" style="width:${percent}%">
                      ${percent}%
                    </div>
                  </div></div>`;

                    swal({
                        title: "Uploading Your Image",
                        content: htmlUpload,
                        button: false,
                    });
                },
            })
            .then((response) => {
                uploaded.value = response.data.imagePath;
                if (response) {
                    swal({
                        icon: "success",
                        text: "Image Upload Successful",
                        button: {
                            className: "btn-success",
                        },
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    });
});

const form = document.querySelector("#product-form");

form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const link = e.target.action
    
    const formData = new FormData(form);
    let fields = Object.fromEntries(formData.entries());

    const editor = tinymce.get("elm1"); // Replace 'elm1' with your editor ID
    const htmlContent = editor.getContent();
    console.log(htmlContent);
    console.log(fields);

    try {
        swal({
            icon: "warning",
            text: "Do you want to add this Product?",
            buttons: {
                cancel: true,
                confirm: {
                    text: "Add",
                    className: "btn-danger",
                },
            },
        }).then(async (res) => {
            if (res == true) {
                const response = await axios.post(link, {
                    product_details: fields,
                    htmlDescription: htmlContent,
                });
                if (response) {
                    swal({
                        icon: "success",
                        text: "Product Added Successfully",
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
            }
        });
    } catch (err) {
        console.error(err);
    }
});

const videoInput = document.querySelector("#video");
const myVideo = document.querySelector("#video-source, #my-video");

videoInput?.addEventListener("change", ({ target: { files } }) => {
    const url = URL.createObjectURL(files[0]);
    myVideo.src = url;

    const formData = new FormData();
    formData.append("video", files[0]);

    axios
        .post(`/${userRole}/product/upload-video`, formData, {
            onUploadProgress: (progressEvent) => {
                const percent = Math.round(
                    (progressEvent.loaded / progressEvent.total) * 100
                );
                // progressBar.style.width = `${percent}%`;
                const htmlUpload = document.createElement("div");
                htmlUpload.innerHTML = `<div style="min-height:20vh;"> <div class="progress rounded-0 h-25px">
                    <div class="progress-bar progress-bar-succes progress-bar-striped activeProgress" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0"
                      aria-valuemax="100" style="width:${percent}%">
                      ${percent}%
                    </div>
                  </div></div>`;

                swal({
                    title: "Uploading Your Video",
                    content: htmlUpload,
                    button: false,
                });
            },
        })
        .then((response) => {
            $("#video-link").val(response.data.videoPath);
            if (response) {
                swal({
                    icon: "success",
                    text: "Video Upload Successful",
                    button: {
                        className: "btn-success",
                    },
                });
            }
        })
        .catch((error) => {
            console.log(error);
            // handle error response
        });
});

const aboutPageForm = document.querySelector("#aboutPageform");

aboutPageForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const aboutFormData = new FormData(aboutPageForm);
    const fields = JSON.stringify(Object.fromEntries(aboutFormData.entries()));

    const imageFormData = new FormData();
    const img = document.querySelector("#aboutImage");

    const editorContent = tinymce.get("elm1")?.getContent();
    const htmlContent = editorContent || "";

    imageFormData.append("image", img.files[0]);
    imageFormData.append("fields", fields);
    imageFormData.append("html", htmlContent);

    try {
        const shouldUpdatePage = await swal({
            icon: "warning",
            text: "Do you want to update this page?",
            buttons: {
                cancel: true,
                confirm: {
                    text: "Yes, update",
                    className: "btn-danger",
                },
            },
        });
        if (shouldUpdatePage) {
            axios.post(`/${userRole}/pages/add-new-page`, imageFormData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
                .then(res => {
                    console.log(res)
                })
                .catch(err => {
                    console.error(err);
                });

            swal({
                icon: "success",
                text: "Page Updated Successfully",
            });
        }
    } catch (error) {
        console.error(error);
    }
});

const aboutLink = document.querySelector('#aboutLink')

$('#aboutLink').on('input', (e) => {
    axios.post(`/${userRole}/pages/verify-page`, {
        urlText: aboutLink.value
    })
        .then(res => {
            console.log(res.status)
            console.log(res.data)

            if (res.status) console.log(res.status)
        })
        .catch(err => {
            console.error(err);
        })
})



privacyPageForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const aboutFormData = new FormData(privacyPageForm);
    const fields = JSON.stringify(Object.fromEntries(aboutFormData.entries()));

    const imageFormData = new FormData();
    const img = document.querySelector("#aboutImage");

    const editorContent = tinymce.get("elm1")?.getContent();
    const htmlContent = editorContent || "";

    imageFormData.append("image", img.files[0]);
    imageFormData.append("fields", fields);
    imageFormData.append("html", htmlContent);

    try {
        const shouldUpdatePage = await swal({
            icon: "warning",
            text: "Do you want to update this page?",
            buttons: {
                cancel: true,
                confirm: {
                    text: "Yes, Update",
                    className: "btn-danger",
                },
            },
        });
        if (shouldUpdatePage) {
            axios.post(`/${userRole}/pages/add-privacy-page`, imageFormData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
                .then(res => {
                    console.log(res)
                })
                .catch(err => {
                    console.error(err);
                });

            swal({
                icon: "success",
                text: "Page Updated Successfully",
            });
        }
    } catch (error) {
        console.error(error);
    }
});