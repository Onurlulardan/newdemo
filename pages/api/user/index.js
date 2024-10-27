import { PrismaClient } from '@prisma/client';
 
import { getToken } from "next-auth/jwt";



const prisma = new PrismaClient();



export default async function handler(req, res) {

   
    if (req.method !== 'GET') {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    }
    

  const { id, page, pageSize, sortField = 'id', sortOrder = 'asc', filterField, filterValue } = req.query;

  let skip, take;
  if (page && pageSize) {
      skip = (parseInt(page) - 1) * parseInt(pageSize);
      take = parseInt(pageSize);
  }

  const relationColumnsData = [];
  
  let where = {};
  
  Object.keys(req.query).forEach((key) => {
    if (key.startsWith('filterField_')) {
      const index = key.split('_')[1];
      const filterField = req.query[`filterField_${index}`];
      const filterValue = req.query[`filterValue_${index}`];
  
      if (filterField && filterValue) {
        const isRelationField = Array.isArray(relationColumnsData) && relationColumnsData.some(column => filterField === column.columnName);
  
        if (isRelationField) {
          relationColumnsData.forEach((column) => {
            if (filterField === column.columnName) {
              if (column.isSelfRelation) {
                where[column.columnName] = {
                  [column.relationModelKey]: {
                    contains: filterValue,
                    mode: 'insensitive'
                  }
                };
              } else {
                where[column.relationModel.toLowerCase()] = {
                  [column.relationModelKey]: {
                    contains: filterValue,
                    mode: 'insensitive'
                  }
                };
              }
            }
          });
        } else {
          
            if (filterField === "id") {
                if ("UUID" === 'Int') {
                    where[filterField] = {
                        equals: parseInt(filterValue)
                    };
                } else if ("UUID" === 'Boolean') {
                    where[filterField] = {
                        equals: filterValue.toLowerCase() === 'true'
                    };
                } else if ("UUID" === 'DateTime') {
                    const [start, end] = filterValue.split(',');
                    where[filterField] = {
                        gte: new Date(start), 
                        lte: new Date(end) 
                    };
                } else {
                    where[filterField] = {
                        contains: filterValue,
                        mode: 'insensitive'
                    };
                }
            }
          
            if (filterField === "name") {
                if ("String" === 'Int') {
                    where[filterField] = {
                        equals: parseInt(filterValue)
                    };
                } else if ("String" === 'Boolean') {
                    where[filterField] = {
                        equals: filterValue.toLowerCase() === 'true'
                    };
                } else if ("String" === 'DateTime') {
                    const [start, end] = filterValue.split(',');
                    where[filterField] = {
                        gte: new Date(start), 
                        lte: new Date(end) 
                    };
                } else {
                    where[filterField] = {
                        contains: filterValue,
                        mode: 'insensitive'
                    };
                }
            }
          
            if (filterField === "email") {
                if ("String" === 'Int') {
                    where[filterField] = {
                        equals: parseInt(filterValue)
                    };
                } else if ("String" === 'Boolean') {
                    where[filterField] = {
                        equals: filterValue.toLowerCase() === 'true'
                    };
                } else if ("String" === 'DateTime') {
                    const [start, end] = filterValue.split(',');
                    where[filterField] = {
                        gte: new Date(start), 
                        lte: new Date(end) 
                    };
                } else {
                    where[filterField] = {
                        contains: filterValue,
                        mode: 'insensitive'
                    };
                }
            }
          
            if (filterField === "password") {
                if ("String" === 'Int') {
                    where[filterField] = {
                        equals: parseInt(filterValue)
                    };
                } else if ("String" === 'Boolean') {
                    where[filterField] = {
                        equals: filterValue.toLowerCase() === 'true'
                    };
                } else if ("String" === 'DateTime') {
                    const [start, end] = filterValue.split(',');
                    where[filterField] = {
                        gte: new Date(start), 
                        lte: new Date(end) 
                    };
                } else {
                    where[filterField] = {
                        contains: filterValue,
                        mode: 'insensitive'
                    };
                }
            }
          
            if (filterField === "active") {
                if ("Boolean" === 'Int') {
                    where[filterField] = {
                        equals: parseInt(filterValue)
                    };
                } else if ("Boolean" === 'Boolean') {
                    where[filterField] = {
                        equals: filterValue.toLowerCase() === 'true'
                    };
                } else if ("Boolean" === 'DateTime') {
                    const [start, end] = filterValue.split(',');
                    where[filterField] = {
                        gte: new Date(start), 
                        lte: new Date(end) 
                    };
                } else {
                    where[filterField] = {
                        contains: filterValue,
                        mode: 'insensitive'
                    };
                }
            }
          
            if (filterField === "createdAt") {
                if ("createdAt" === 'Int') {
                    where[filterField] = {
                        equals: parseInt(filterValue)
                    };
                } else if ("createdAt" === 'Boolean') {
                    where[filterField] = {
                        equals: filterValue.toLowerCase() === 'true'
                    };
                } else if ("createdAt" === 'DateTime') {
                    const [start, end] = filterValue.split(',');
                    where[filterField] = {
                        gte: new Date(start), 
                        lte: new Date(end) 
                    };
                } else {
                    where[filterField] = {
                        contains: filterValue,
                        mode: 'insensitive'
                    };
                }
            }
          
            if (filterField === "updatedAt") {
                if ("updatedAt" === 'Int') {
                    where[filterField] = {
                        equals: parseInt(filterValue)
                    };
                } else if ("updatedAt" === 'Boolean') {
                    where[filterField] = {
                        equals: filterValue.toLowerCase() === 'true'
                    };
                } else if ("updatedAt" === 'DateTime') {
                    const [start, end] = filterValue.split(',');
                    where[filterField] = {
                        gte: new Date(start), 
                        lte: new Date(end) 
                    };
                } else {
                    where[filterField] = {
                        contains: filterValue,
                        mode: 'insensitive'
                    };
                }
            }
          
        }
      }
    }
  });
  
  let orderBy = {};
  if (sortField) {
    const isRelationField = Array.isArray(relationColumnsData) && relationColumnsData.some(column => sortField === column.columnName);
  
    if (isRelationField) {
      
    } else {
      orderBy[sortField] = sortOrder === 'ascend' ? 'asc' : 'desc';
    }
  }

  const idCondition = 
    
      
        id  
      
    
  
    
  
    
  
    
  
    
  
    
  
    
  ;

  switch (req.method) {
    case 'GET':
      try {
        if (id) {
          const result = await prisma.user.findUnique({
            where: { id: idCondition },
            
          });
          if (result) {
            res.status(200).json(result);
          } else {
            res.status(404).json({ error: "user not found" });
          }
        } else {
          const results = await prisma.user.findMany({
            skip,
            take,
            orderBy,
            where,
            
          });
          const totalCount = await prisma.user.count({ where });
          res.status(200).json({ data: results, pagination: {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            total: totalCount,
          }});
        }
      } catch (error) {
        res.status(500).json({ error: "Error fetching user" });
      }
      break;

      case 'POST':
      try {
        const postData = { ...req.body };
        
        
    
        const newUser = await prisma.user.create({
          data: {
            ...postData,
            
            
        }
        });
        res.status(201).json(newUser);
      } catch (error) {
        res.status(500).json({ error: "Error creating user" });
      }
      break;
    
      case 'PUT':
      try {
        const putData = { ...req.body };
    
        const existingRecord = await prisma.user.findUnique({
          where: { id: idCondition }
        });
    
        if (!existingRecord) {
          return res.status(404).json({ error: "user not found" });
        }
    
        
    
    
        const updatedUser = await prisma.user.update({
          where: { id: idCondition },
          data: {
            ...putData,
            
            
        }
        });
    
        res.status(200).json(updatedUser);
      } catch (error) {
        res.status(500).json({ error: "Error updating user" });
      }
      break;

    case 'DELETE':
      try {
        const existingRecord = await prisma.user.findUnique({
          where: { id: idCondition }
        });

        

        await prisma.user.delete({
          where: { id: idCondition },
        });
        res.status(200).json({ message: "user deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Error deleting user" });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}