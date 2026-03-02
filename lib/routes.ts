export const routes = {
  home: '/',
  vault: '/vault',
  myBlackbook: '/my-blackbook',
  editProfile: '/edit-profile',
  contact: (id: string) => `/contact/${id}`,
  share: '/share',
  creativeDirector: '/creative-director',
  photographerBeige: '/photographer-beige',
  ecommerceSpecialist: '/ecommerce-specialist',
  saveConfirmation: '/save-confirmation',
} as const;
