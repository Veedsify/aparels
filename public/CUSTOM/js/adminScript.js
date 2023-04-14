// DELETE CATEGORY ANIMATION
// select all delete category buttons and convert to an array
const DELETE_CATEGORY_BTN = Array.from($(".delete-category"));

// add click event listener to each button
DELETE_CATEGORY_BTN.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let id = e.target.getAttribute("data-category");
    swal({
      icon: "/IMAGES/trash-100.gif",
      text: "Do you want to delete this category?",
      className: "btn-sm",
      buttons: {
        cancel: true,
        confirm: {
          text: "Yes, delete",
          className: "bg-danger",
        },
      },
    }).then((res) => {
      if (res == true) {
        axios
          .delete(`/${userRole}/product/category`, {
            data: {
              id,
            },
          })
          .then((res) => {
            if (res.data) {
              checkResponse(res.data);
              const parent = btn.closest(".card");
              parent.remove();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  });
});

// ADD CATEGORY

$("#add-category").click(function (e) {
  e.preventDefault();

  swal({
    title: "New Category",
    content: categoryForm(`/${userRole}/product/category/add`, "POST"),
    button: {
      text: "Cancel",
      className: "bg-danger d-block",
    },
  });
});

$(document).on("change", "#prev-file-image", function (e) {
  // code to run when .my-target is clicked
  try {
    document.querySelector("#category-prev-img").src = URL.createObjectURL(
      e.target.files[0]
    );
  } catch (err) {
    document.querySelector("#category-prev-img").src = "/IMAGES/img.svg";
  }
});

// DELETE & APPROVE PRODUCT ON APPROVE PAGE
const handleProductAction = async (
  selector,
  icon,
  text,
  confirmBtnClass,
  method,
  action
) => {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener("click", async () => {
      const result = await swal({
        icon,
        text,
        buttons: {
          cancel: true,
          confirm: {
            text: "Yes",
            className: `${confirmBtnClass} shadow-0`,
          },
        },
      });
      if (result == true) {
        const productId = el.getAttribute("data-product");
        try {
          const response = await axios({
            method,
            url: "/admin/product/status",
            data: { productId, action },
          });
          if (response) {
            swal({
              icon: 'success',
              text: 'Successful',
              button: {
                className: 'bg-primary',
              }
            }).then((res) => {
              if (res) window.location.reload();
            })
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  });
};

handleProductAction(
  ".delete-product",
  "warning",
  "Are you sure you want to delete this product?",
  "btn-danger",
  "DELETE",
  "rejectProduct"
);
handleProductAction(
  ".accept-product",
  "info",
  "Are you sure you want to approve this product?",
  "btn-success",
  "PUT",
  "approveProduct"
);
handleProductAction(
  ".hide-product",
  "info",
  "Are you sure you want to hide this product on the home page?",
  "btn-success",
  "POST",
  "hideProduct"
);
handleProductAction(
  ".show-product",
  "info",
  "Are you sure you want to show this product on the home page?",
  "btn-success",
  "PUT",
  "show"
);

const handleUserStatus = async (
  selector,
  icon,
  text,
  confirmBtnClass,
  method
) => {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener("click", async (e) => {
      const result = await swal({
        icon,
        text,
        buttons: {
          cancel: true,
          confirm: {
            text: "Yes",
            className: `${confirmBtnClass} shadow-0`,
          },
        },
      });
      if (result == true) {
        const userid = el.getAttribute("data-users");
        try {
          const response = await axios({
            method,
            url: `/${userRole}/user/status`,
            data: { userid },
          });
          window.location.reload();
        } catch (error) {
          console.error(error);
        }
      }
    });
  });
};

handleUserStatus(
  ".delete-user",
  "warning",
  "Are you sure you want to delete this user?",
  "btn-danger",
  "DELETE"
);

handleUserStatus(
  ".delete-regular-user",
  "warning",
  "Are you sure you want to delete this user?",
  "btn-danger",
  "DELETE"
);

const userClassHandler = async (selector, confirmBtnClass, method) => {
  for (const el of document.querySelectorAll(selector)) {
    const userData = el.getAttribute("data-users");
    el.addEventListener("click", async () => {
      const response = await axios({
        method: "POST",
        url: "/admin/user/get-data",
        data: { userData },
      });
      const result = await swal({
        content: getRoles(userData, response.data),
        buttons: {
          cancel: true,
        },
      });
    });
  }
};

userClassHandler(".edit-user", "btn-danger", "POST");

const userStatusHandler = async (selector, confirmBtnClass, method) => {
  for (const el of document.querySelectorAll(selector)) {
    const userData = el.getAttribute("data-users");

    el.addEventListener("click", async () => {
      swal({
        icon: "/IMAGES/load.gif",
        text: "Fetching User Data",
        buttons: false,
      });
      await axios
        .post(`/${userRole}/user/get-user-data`, {
          userData,
        })
        .then((res) => {
          if (res.status == 200) {
            swal({
              content: getUserStatus(userData, res.data.user),
              buttons: {
                cancel: true,
              },
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }
};

userStatusHandler(".update-user", "btn-success", "POST");

//VENDOR PAGES

let addVendor = document.querySelector("#add-vendor");

if (addVendor) {
  addVendor.addEventListener("click", () => {
    swal({
      title: "Add a Vendor",
      content: addVendorHtml(),
      button: {
        text: "Cancel",
        cancel: true,
        className: "btn btn-danger",
      },
    });
  });
}

$("#updateSMTP").on("submit", function (event) {
  event.preventDefault();

  axios
    .post("/admin/configuration/update/smtp", {
      SMTP_HOST: $("#smtp_host").val(),
      SMTP_PORT: $("#smtp_port").val(),
      SMTP_USER: $("#smtp_user").val(),
      SMTP_PASSWORD: $("#smtp_password").val(),
    })
    .then((res) => {
      swal({
        text: res.data.message,
        button: {
          className: "btn-primary",
        },
      }).then((response) => {
        if (response == true) {
          window.location.reload();
        }
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

$("#updateEmails").on("submit", function (event) {
  event.preventDefault();

  axios
    .post("/admin/configuration/update/email", {
      admin_email: $("#admin_email").val(),
      contact_email: $("#contact_email").val(),
      inbox_email: $("#inbox_email").val(),
      customer_email: $("#customer_email").val(),
    })
    .then((res) => {
      swal({
        text: res.data.message,
        button: {
          className: "btn-primary",
        },
      }).then((response) => {
        if (response == true) {
          window.location.reload();
        }
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

$("#updatePayment").on("submit", function (event) {
  event.preventDefault();

  axios
    .post("/admin/configuration/update/paystack", {
      public_key: $("#public_key").val(),
      secret_key: $("#secret_key").val(),
      currency: $("#currency").val(),
    })
    .then((res) => {
      swal({
        text: res.data.message,
        button: {
          className: "btn-primary",
        },
      }).then((response) => {
        if (response == true) {
          window.location.reload();
        }
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

const approveOrder = document.querySelectorAll(".approveOrder");

for (approvebtn of approveOrder) {
  approvebtn.addEventListener("click", async (e) => {
    e.preventDefault();
    let orderid = approvebtn.getAttribute("data-id");

    await axios
      .post(`/${userRole}/order/approveOrder`, {
        orderid,
      })
      .then((res) => {
        console.log(res);
        swal({
          icon: "success",
          text: "The order has been moved to the processing table. Would you like to see the page?",
          button: {
            confirm: {
              text: "Yes",
              className: "bg-success",
            },
          },
        }).then((res) => {
          if (res == true) {
            location.href = `/${userRole}/order/processing`;
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
}
const readyOrder = document.querySelectorAll(".readyOrder");

for (approvebtn of readyOrder) {
  approvebtn.addEventListener("click", async (e) => {
    e.preventDefault();
    let orderid = approvebtn.getAttribute("data-id");

    await axios
      .post(`/${userRole}/order/readyOrder`, {
        orderid,
      })
      .then((res) => {
        console.log(res);
        swal({
          icon: "success",
          text: "The order has been moved to the ready order table. Would you like to see the page?",
          button: {
            confirm: {
              text: "Yes",
              className: "bg-success",
            },
          },
        }).then((res) => {
          if (res == true) {
            location.href = `/${userRole}/order/ready`;
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

const shippedOrder = document.querySelectorAll(".shippedOrder");

for (approvebtn of shippedOrder) {
  approvebtn.addEventListener("click", async (e) => {
    e.preventDefault();
    let orderid = approvebtn.getAttribute("data-id");

    await axios
      .post(`/${userRole}/order/shippedOrder`, {
        orderid,
      })
      .then((res) => {
        console.log(res);
        swal({
          icon: "success",
          text: "The order has been moved to the shipped order table. Would you like to see the page?",
          button: {
            confirm: {
              text: "Yes",
              className: "bg-success",
            },
          },
        }).then((res) => {
          if (res == true) {
            location.href = `/${userRole}/order/shipped`;
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

const deliveredOrder = document.querySelectorAll(".deliveredOrder");

for (approvebtn of deliveredOrder) {
  approvebtn.addEventListener("click", async (e) => {
    e.preventDefault();
    let orderid = approvebtn.getAttribute("data-id");

    await axios
      .post(`/${userRole}/order/deliveredOrder`, {
        orderid,
      })
      .then((res) => {
        console.log(res);
        swal({
          icon: "success",
          text: "The order has been moved to the delivered order table. Would you like to see the page?",
          button: {
            confirm: {
              text: "Yes",
              className: "bg-success",
            },
          },
        }).then((res) => {
          if (res == true) {
            location.href = `/${userRole}/order/delivered`;
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

const cancelOrder = document.querySelectorAll(".cancelOrder");

for (cancelBtn of cancelOrder) {
  cancelBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    let orderid = cancelBtn.getAttribute("data-id");

    swal({
      icon: "warning",
      text: "Are you sure you want to cancel this order?",
      button: {
        confirm: {
          text: "Yes",
          className: "bg-success",
        },
      },
    }).then(async (response) => {
      if (response == true) {
        await axios
          .post(`/${userRole}/order/cancelOrder`, {
            orderid,
          })
          .then((res) => {
            swal({
              icon: "success",
              text: "The order has been cancelled, and refund should be processed",
              button: {
                text: "Yes",
                className: "bg-success",
              },
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  });
}
const hideOrder = document.querySelectorAll(".hideOrder");

for (hideBtn of hideOrder) {
  hideBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    let orderid = cancelBtn.getAttribute("data-id");

    swal({
      icon: "warning",
      text: "Are you sure you want to hide this order?",
      button: {
        confirm: {
          text: "Yes",
          className: "bg-success",
        },
      },
    }).then(async (response) => {
      if (response == true) {
        await axios
          .post(`/${userRole}/order/hideOrder`, {
            orderid,
          })
          .then((res) => {
            swal({
              icon: "success",
              text: "The order has been hidden to view this order again use the advanced order search",
              button: {
                text: "ok",
                className: "bg-success",
              },
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  });
}

$("#add-team").click(async function (e) {
  e.preventDefault();
  await swal({
    title: "Add New Team Member",
    content: newTeamForm(`/${userRole}/pages/add-new-member`, "POST"),
    button: {
      text: "Cancel",
      className: "btn-danger",
    },
  });
});

const removeTeamBtns = document.querySelectorAll(".removeTeam");

for (removeTeam of removeTeamBtns) {
  removeTeam.addEventListener("click", async (e) => {
    await swal({
      icon: "/IMAGES/trash-100.gif",
      text: "Are you sure you want to remove this team member?",
      buttons: {
        cancel: true,
        confirm: {
          text: "Yes, remove",
          className: "bg-danger",
        },
      },
    }).then(async (res) => {
      if (res) {
        const id = removeTeam.getAttribute("data-id");
        const response = await axios.delete(
          `/${userRole}/configuration/del/${id}`
        );
        if (response.status == 200) {
          window.location.reload();
        }
      }
    });
  });
}

function checkResponse(res) {
  if (res.link) {
    window.location.href = res.link;
  } else {
    swal({
      text: res.message,
      button: {
        className: "btn-primary",
      },
    });
  }
}

async function banVendor(vendor_id) {
  await swal({
    text: "Are you sure you want to ban this vendor?",
    icon: "warning",
    buttons: {
      cancel: true,
      confirm: {
        text: "Yes Ban",
        className: "btn-danger",
      },
    },
  }).then((res) => {
    if (res) {
      axios
        .post(`/${userRole}/user/vendors/status`, {
          vendorID: vendor_id,
          action: "ban",
        })
        .then((res) => {
          if (res.status == 200) {
            swal({
              text: "Vendor Has Been Banned",
              icon: "success",
              button: { className: "btn-success" },
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });
}
async function activateVendor(vendor_id) {
  await swal({
    text: "Are you sure you want to activate this vendor?",
    icon: "warning",
    buttons: {
      cancel: true,
      confirm: {
        text: "Yes Activate",
        className: "btn-danger",
      },
    },
  }).then((res) => {
    if (res) {
      axios
        .post(`/${userRole}/user/vendors/status`, {
          vendorID: vendor_id,
          action: "activate",
        })
        .then((res) => {
          if (res.status == 200) {
            swal({
              text: "Vendor Has Been Activated",
              icon: "success",
              button: { className: "btn-success" },
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });
}
async function deleteVendor(vendor_id) {
  await swal({
    text: "Are you sure you want to delete this vendor?",
    icon: "warning",
    buttons: {
      cancel: true,
      confirm: {
        text: "Yes Delete",
        className: "btn-danger",
      },
    },
  }).then((res) => {
    if (res) {
      axios
        .post(`/${userRole}/user/vendors/status`, {
          vendorID: vendor_id,
          action: "delete",
        })
        .then((res) => {
          if (res.status == 200) {
            swal({
              text: "Vendor Has Been Deleted",
              icon: "success",
              button: { className: "btn-success" },
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });
}

$("#blog_image").on("change", function (e) {
  try {
    var imageFile = URL.createObjectURL(e.target.files[0]);
    $(this).closest("label").find("img").attr("src", imageFile);
  } catch (err) {
    $(this).closest("label").find("img").attr("src", "/IMAGES/image.png");
  }
});

function rejectPost(id) {
  swal({
    text: "Do you want to reject this post?",
    icon: "warning",
    buttons: {
      cancel: true,
      confirm: {
        text: "Yes, Reject",
        className: "bg-danger",
      },
    },
  }).then((res) => {
    if (res) {
      swal({
        title: "Why was this not accepted?",
        content: {
          element: "textarea",
          attributes: {
            placeholder: "Type your reason",
            height: "200",
            id: "reject_reason",
          },
        },
        buttons: {
          cancel: true,
          confirm: {
            text: "Send",
            className: "bg-primary",
          },
        },
      }).then((res) => {
        if (res) {
          const textareaValue = document.querySelector(
            ".swal-content textarea"
          ).value;
          axios
            .post(`/${userRole}/blog/audit/`, {
              action: "inactive",
              id,
              textareaValue
            })
            .then((res) => {
              swal({
                icon: "success",
                button: {
                  className: "bg-success",
                },
                text: "Post has been rejected",
              }).then(res => {
                window.location.reload()
              })
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }
  });
}

function approvePost(id) {
  swal({
    text: "Do you want to approve this post?",
    icon: "warning",
    buttons: {
      cancel: true,
      confirm: {
        text: "Yes, Approve",
        className: "bg-success",
      },
    },
  }).then((res) => {
    if (res) {
      axios
        .post(`/${userRole}/blog/audit/`, {
          action: "active",
          id,
          textareaValue: ''
        })
        .then((res) => {
          swal({
            icon: "success",
            button: {
              className: "bg-success",
            },
            text: "Post has been approved",
          }).then(res => {
            window.location.reload()
          })
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

function approveProducts(id) {
  swal({
    text: "Do you want to approve this post?",
    icon: "warning",
    buttons: {
      cancel: true,
      confirm: {
        text: "Yes, Approve",
        className: "bg-success",
      },
    },
  }).then((res) => {
    if (res) {
      axios
        .post(`/${userRole}/blog/audit/`, {
          action: "active",
          id,
          textareaValue: ''
        })
        .then((res) => {
          swal({
            icon: "success",
            button: {
              className: "bg-success",
            },
            text: "Post has been approved",
          }).then(res => {
            window.location.reload()
          })
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

function delePost(id) {
  swal({
    text: "Do you want to delete this post?",
    icon: "warning",
    buttons: {
      cancel: true,
      confirm: {
        text: "Yes, Delete",
        className: "bg-danger",
      },
    },
  }).then((res) => {
    if (res) {
      axios
        .delete(`/${userRole}/blog/audit/`, {
          data: {
            id
          },
        })
        .then((res) => {
          swal({
            icon: "success",
            button: {
              className: "bg-success",
            },
            text: "Post has been deleted",
          }).then(res => {
            window.location.reload()
          })
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

function deleteProduct(id) {
  swal({
    text: "Do you want to delete this product?",
    icon: "warning",
    buttons: {
      cancel: true,
      confirm: {
        text: "Yes, Delete",
        className: "bg-danger",
      },
    },
  }).then((res) => {
    if (res) {
      axios
        .delete(`/${userRole}/product/audit/`, {
          data: {
            id
          },
        })
        .then((res) => {
          swal({
            icon: "success",
            button: {
              className: "bg-success",
            },
            text: "Product has been deleted",
          }).then(res => {
            window.location.reload()
          })
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}
