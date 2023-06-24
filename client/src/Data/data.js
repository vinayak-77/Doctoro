export const userMenu = [
  {
    name: "Home",
    path: "/",
    icon: "fa-solid fa-house",
  },
  {
    name: "Appointments",
    path: "/appointments",
    icon: "fa-solid fa-list",
  },
  {
    name: "Apply As A Doctor",
    path: "/apply-doctor",
    icon: "fa-solid fa-user-doctor",
  },
  {
    name: "Chat",
    path: "/chat-home",
    icon: "fa-solid fa-message",
  },
];

export const adminMenu = [
  {
    name: "Home",
    path: "/",
    icon: "fa-solid fa-house",
  },

  {
    name: "Doctors",
    path: "/admin/doctors",
    icon: "fa-solid fa-user-doctor",
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: "fa-solid fa-user",
  },
  // {
  //   name: "Profile",
  //   path: "/profile",
  //   icon: "fa-solid fa-user",
  // },
];

export const doctorMenu = [
  {
    name: "Home",
    path: "/",
    icon: "fa-solid fa-house",
  },
  {
    name: "Appointments",
    path: "/doctor-appointments",
    icon: "fa-solid fa-list",
  },

  {
    name: "Profile",
    path: "/doctor/profile/:id",
    icon: "fa-solid fa-user",
  },
  {
    name: "Chat",
    path: "/chat-home",
    icon: "fa-solid fa-message",
  },
];
