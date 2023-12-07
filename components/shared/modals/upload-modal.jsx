/* eslint-disable @next/next/no-img-element */
import * as Dialog from "@radix-ui/react-dialog";
import { useState, useCallback } from "react";
import Image from "next/image";
import closeSVG from "@/public/close_button.svg";
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useQueryClient } from "@tanstack/react-query";
import useCurrentUser from "@/hooks/useCurrentUser";

const UploadModal = ({ onChange, value, submit }) => {
	const [base64, setBase64] = useState(value);
	const { data: currentUser } = useCurrentUser();

	const handleChange = useCallback(
		(base64) => {
			onChange(base64);
		},
		[onChange]
	);

	const queryClient = useQueryClient();

	const handleDrop = useCallback(
		(files) => {
			const file = files[0];
			const maxSize = 5 * 1024 * 1024; // 5MB

			if (file.size > maxSize) {
				alert("Max file size exceeded. Please upload a file under 5MB.");
				return;
			}

			const reader = new FileReader();
			reader.onload = (event) => {
				setBase64(event.target.result);
				handleChange(event.target.result);
			};
			reader.readAsDataURL(file);
			queryClient.invalidateQueries(["users", currentUser?.handle]);
		},
		[currentUser?.handle, handleChange, queryClient]
	);

	const { getRootProps, getInputProps } = useDropzone({
		maxFiles: 1,
		onDrop: handleDrop,
		accept: {
			"image/jpeg": [],
			"image/png": [],
		},
	});

	return (
		<>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 backdrop-blur-sm bg-gray-800 bg-opacity-50 sm:w-full" />
				<Dialog.Content
					className="contentShow z-40 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    rounded-2xl bg-white p-6 sm:p-8 lg:max-w-3xl w-[350px] sm:w-[500px] shadow-lg 
                    md:max-w-lg max-md:max-w-lg focus:outline-none">
					<div className="flex flex-row justify-between items-center mb-4">
						<Dialog.Title className="text-xl text-center font-medium mb-2 sm:mb-0 sm:mr-4">
							Upload Image
						</Dialog.Title>
						<Dialog.Close className="flex flex-end justify-end">
							<div className="p-2 rounded-full flex justify-center items-center bg-gray-100 hover:bg-gray-300">
								<Image priority src={closeSVG} alt="close" />
							</div>
						</Dialog.Close>
					</div>
					<div
						{...getRootProps({
							className:
								"w-full h-[200px] flex justify-center border-2 border-dashed rounded-md p-10 my-4",
						})}>
						<input
							className="w-full h-[200px] "
							type="file"
							{...getInputProps()}
						/>
						{base64 ? (
							<div className="">
								<img
									alt="uploaded-image"
									loading="lazy"
									className="overflow-hidden object-cover w-[100px] h-[100px] rounded-full"
									src={base64}
								/>
							</div>
						) : (
							<>
								<div className="mb-4">
									<h3 className="text-center">
										Drag and drop an image or click to
										upload{" "}
									</h3>
									<h3 className="text-center">
										(Max file size 5MB) ✨
									</h3>
								</div>
								<div className=" my-6 absolute top-1/2 transform -translate-y-1/2">
									<Upload size={40} className="text-gray-400" />
								</div>
							</>
						)}
					</div>
					<Dialog.Close asChild>
						<button
							onClick={submit}
							className="inline-block w-full px-4 py-4 bg-slate-900 leading-none 
                            text-lg mt-2 text-white rounded-3xl hover:bg-slate-700">
							Upload image 🚀
						</button>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</>
	);
};

export default UploadModal;
