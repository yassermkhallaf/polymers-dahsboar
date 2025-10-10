import { Hono } from "hono";
import { db } from "@/lib/database-prisma";
import connectDB from "@/lib/database-monogdb";
const app = new Hono();
app
  .post("/batches-info-seeding", async (c) => {
    try {
      const body = await c.req.json();
      await Promise.all(
        body.map((item) =>
          db.batch.upsert({
            where: { global_id: item.global_id },
            update: {
              routing_no: item.routing_no,
              item_code: item.item_code,
              description: item.description,
              item_category: item.item_category,
              cust_name: item.cust_name,
              cust_type: item.cust_type,
              cust_country: item.cust_country,
              sales_rep: item.sales_rep,
            },
            create: {
              batch_no: item.batch_no,
              global_id: item.global_id,
              routing_no: item.routing_no,
              item_code: item.item_code,
              description: item.description,
              item_category: item.item_category,
              cust_name: item.cust_name,
              cust_type: item.cust_type,
              cust_country: item.cust_country,
              sales_rep: item.sales_rep,
            },
          })
        )
      );

      return c.json({ message: "success" }, 200);
    } catch (e) {
      console.log(e);
      return c.json({ error: "Invalid request" }, 400);
    }
  })
  .post("/batches-increments-seeding", async (c) => {
    try {
      const body = await c.req.json();

      await db.increment.deleteMany({
        where: { increment_id: body.increment_id },
      });
      await Promise.all(
        body.data.map((item) =>
          db.increment.create({
            data: {
              global_id: item.global_id,
              batch_no: item.batch_no,
              increment_id: item.increment_id,
              quantity: item.qty,
              created_at: item.created_at,
            },
          })
        )
      );
      return c.json({ message: "success" }, 200);
    } catch (error) {
      console.log(error);
      return c.json({ error: "Invalid request" }, 400);
    }
  })
  .get("/dashboard-data", async (c) => {
    try {
      connectDB();
      const { from, to } = c.req.query();

      const start = new Date(`${from}T00:00:00.000Z`);
      const end = new Date(`${to}T23:59:59.999Z`);
      // console.log(start, end);
      const rawBachesData = await db.increment.findMany({
        where: {
          created_at: {
            gt: start,
            lte: end,
          },
        },
        include: {
          batch: {
            select: {
              routing_no: true,
              item_code: true,
              item_category: true,
              description: true,
              cust_name: true,
              cust_type: true,
              cust_country: true,
              sales_rep: true,
            },
          },
        },
      });
      //adding the routing name to the database
      const batches = rawBachesData.map((batch) => {
        return {
          ...batch,
          routing_no: batch.batch?.routing_no,
          item_code: batch.batch?.item_code,
          item_category: batch.batch?.item_category,
          description: batch.batch?.description,
          cust_name: batch.batch?.cust_name,
          cust_type: batch.batch?.cust_type,
          cust_country: batch.batch?.cust_country,
          sales_rep: batch.batch?.sales_rep,
          batch: undefined,
        };
      });
      const routingNames = [
        "C1",
        "C2",
        "J1",
        "J2",
        "J3",
        "L1",
        "L2",
        "L3",
        "L4",
        "L7",
      ];

      const routingNamesMap = new Map();
      routingNames.forEach((routingName) => {
        routingNamesMap.set(routingName, 0);
      });
      batches.forEach((batch) => {
        const qty = batch.quantity;
        const routingName = batch.routing_no;
        if (routingName) {
          routingNamesMap.set(
            routingName,
            routingNamesMap.get(routingName) + qty
          );
        } else {
          console.log(batch);
        }
      });

      const categoryMap = new Map();
      batches.forEach((batch) => {
        const category = batch.item_category;
        if (category) {
          categoryMap.set(
            category,
            (categoryMap.get(category) || 0) + batch.quantity
          );
        }
      });
      const customerTypeMap = new Map();
      batches.forEach((batch) => {
        const customerType = batch.cust_type;

        if (customerType) {
          customerTypeMap.set(
            customerType,
            (customerTypeMap.get(customerType) || 0) + batch.quantity
          );
        }
      });

      const customerCountryMap = new Map();
      batches.forEach((batch) => {
        const customerCountry = batch.cust_country;
        if (customerCountry) {
          customerCountryMap.set(
            customerCountry,
            (customerCountryMap.get(customerCountry) || 0) + batch.quantity
          );
        }
      });

      const salesRepMap = new Map();
      batches.forEach((batch) => {
        const salesRep = batch.sales_rep;
        if (salesRep) {
          salesRepMap.set(
            salesRep,
            (salesRepMap.get(salesRep) || 0) + batch.quantity
          );
        }
      });
      const totalQty = batches.reduce(
        (total, batch) => total + batch.quantity,
        0
      );
      const customerTypeObj = { external: 0, internal: 0 };
      batches.forEach((batches, i) => {
        if (batches.cust_type === "External") {
          customerTypeObj.external += batches.quantity;
        } else {
          customerTypeObj.internal += batches.quantity;
        }
      });

      return c.json(
        {
          customerTypeObj,
          totalQty,
          customerType: Array.from(customerTypeObj, ([key, value]) => {
            return {
              type: key,
              value,
            };
          }),
          batches,
          routingData: Array.from(routingNamesMap, ([routingName, qty]) => ({
            routingName,
            value: qty,
          })),
          categoryData: Array.from(categoryMap, ([category, qty]) => ({
            category,
            value: qty,
          })),
          customerTypeData: Array.from(
            customerTypeMap,
            ([customerType, qty]) => ({
              customerType,
              value: qty,
            })
          ),
          customerCountryData: Array.from(
            customerCountryMap,
            ([customerCountry, qty]) => ({
              customerCountry,
              value: qty,
            })
          ),
          salesRepData: Array.from(salesRepMap, ([salesRep, qty]) => ({
            salesRep,
            value: qty,
          })),
        },
        200
      );
    } catch (error) {
      console.log(error);
      return c.json({ error: "Invalid request" }, 400);
    }
  });

export default app;
