import swal from 'sweetalert';

export const message = (title: string, message: string, success: boolean) => {

  swal({
    title,
    text: message,
    icon: success ? 'success' : 'error',
    dangerMode: !success,
  })
}