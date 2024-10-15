import { Router, Request, Response, NextFunction } from "express";
import { check } from "express-validator";
import { handleValidationErrors } from "../../utils/validation.js";

const router = Router();

import bcrypt from "bcryptjs";
import { setTokenCookie, restoreUser, requireAuth } from "../../utils/auth.js";
import { prisma } from "../../dbclient.js";

router.get("/current", requireAuth, async (req, res) => {
	const user = req.user!;

	let bookings = await prisma.booking.findMany({
		where: { userId: user.id },
		include: {
			spot: {
				select: {
					images: { where: { preview: true }, select: { url: true } },
					id: true,
					ownerId: true,
					address: true,
					city: true,
					state: true,
					country: true,
					lat: true,
					lng: true,
					name: true,
					price: true,
				},
			},
		},
	});

	const sequelized = bookings.map((b) => {
		const { spot, startDate, endDate, ...rest } = b;

		const { images, ...spotRest } = spot;
		return {
			Spot: {
				previewImage: images[0]?.url ?? "",
				...spotRest,
			},
			startDate: startDate.toDateString(),
			endDate: endDate.toDateString(),
			...rest,
		};
	});

	where:""

	return res.json({ Bookings: sequelized });
});


// delete booking by  bookingid


router.delete('/:bookingId', requireAuth, async (req, res) => {
	return async (req: Request, res: Response) => {
	  const { bookingId } = req.params;
  
	  if (isNaN(Number(bookingId)) || Number(bookingId) > 2 ** 31) {
		return res.status(404).json({ message: "Booking couldn't be found" });
	  }
  
	  const userId = req.user!.id;
  
	  try {
		const booking = await prisma.booking.findUnique({
		  where: {
			id: Number(bookingId),
		  },
		  include: {
			spot: {
			  select: {
				ownerId: true,
			  },
			},
		  },
		});
  
		if (!booking) {
		  if (!(await prisma.booking.findUnique({ where: { id: Number(bookingId) } }))) {
			return res.status(404).json({ message: "Booking couldn't be found" });
		  }
		  return res.status(403).json({ message: "You are not authorized to delete this booking" });
		}
  
		if (booking.userId !== userId && booking.spot.ownerId !== userId) {
		  return res.status(403).json({ message: "You are not authorized to delete this booking" });
		}
  
		await prisma.booking.delete({ where: { id: Number(bookingId) } });
		return res.status(200).json({ message: "successfully deleted" });
	  } catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal Server Error" });
	  }
	};
  });









export default router;
