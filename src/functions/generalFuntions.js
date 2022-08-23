
import { storage } from "../helpers/Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const updateImage = async (imgFile ) => {

    const storageRef = ref(storage, `/files/${imgFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imgFile);

    var urlImage = await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
              const percent = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              console.log(percent);
          },
          (err) => reject(err),
          () => {
              // download url
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                console.log(url)
                resolve(url);
              });
          }
        );
      });

    return urlImage;

};

export {
    updateImage
}