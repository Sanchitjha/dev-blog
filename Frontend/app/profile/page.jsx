// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import ParticleBackground from "@/components/particle-background";
// import { useToast } from "@/hooks/use-toast";
// import Link from "next/link";

// function ProfileContent() {
//   const router = useRouter();
//   const { toast } = useToast();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [image, setImage] = useState("");

//   useEffect(() => {
//     if (!ready) return;
//     if (!user) {
//       router.replace("/login");
//     } else {
//       setName(user.name || "");
//       setEmail(user.email || "");
//       setPhone(user.phone || "");
//       setImage(user.image || "");
//     }
//   }, [ready, user, router]);

//   function onSave(e) {
//     e.preventDefault();
//     updateUser({
//       name: name.trim(),
//       email: email.trim(),
//       phone: phone.trim(),
//       image: image.trim(),
//     });
//     toast({
//       title: "Profile updated",
//       description: "Your profile has been saved.",
//     });
//   }

//   const initials =
//     (name || email || "U")
//       .split(" ")
//       .map((s) => s[0]?.toUpperCase())
//       .slice(0, 2)
//       .join("") || "U";

//   return (
//     <div className="relative min-h-screen">
//       <ParticleBackground className="opacity-90" />

//       <div className="absolute left-0 top-0 p-4">
//         <Button asChild variant="ghost">
//           <Link href="/">← Back</Link>
//         </Button>
//       </div>

//       <div className="flex min-h-screen items-center justify-center px-4">
//         <Card className="w-full max-w-2xl backdrop-blur bg-white/90">
//           <CardHeader>
//             <CardTitle>Profile</CardTitle>
//             <CardDescription>
//               Update your personal information and profile photo.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form className="grid gap-5" onSubmit={onSave}>
//               <div className="flex items-center gap-4">
//                 <Avatar className="h-16 w-16 border">
//                   <AvatarImage src={image || ""} alt={name || "User"} />
//                   <AvatarFallback>{initials}</AvatarFallback>
//                 </Avatar>
//                 <div className="grid w-full gap-2">
//                   <Label htmlFor="image">Photo URL</Label>
//                   <Input
//                     id="image"
//                     placeholder="https://example.com/avatar.jpg"
//                     value={image}
//                     onChange={(e) => setImage(e.target.value)}
//                   />
//                   <div className="flex gap-2">
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       onClick={() => setImage("")}
//                     >
//                       Remove photo
//                     </Button>
//                   </div>
//                 </div>
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="name">Name</Label>
//                 <Input
//                   id="name"
//                   placeholder="Jane Doe"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="jane@example.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="phone">Phone</Label>
//                 <Input
//                   id="phone"
//                   type="tel"
//                   placeholder="+1 555 0100"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                 />
//               </div>

//               <div className="flex items-center gap-3">
//                 <Button
//                   type="submit"
//                   className="bg-emerald-600 hover:bg-emerald-700"
//                 >
//                   Save changes
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => router.push("/")}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// export default function ProfilePage() {
//   return (
//     <AuthProvider>
//       <ProfileContent />
//     </AuthProvider>
//   );
// }
