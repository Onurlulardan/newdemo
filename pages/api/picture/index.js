import { PrismaClient } from '@prisma/client';
 
import { getToken } from "next-auth/jwt";

 
import fs from 'fs';
import path from 'path';
import { uploadBase64ToUploads, deleteAssociatedFiles } from '@/core/helpers/backend';


const prisma = new PrismaClient();

 
  export const config = {
    api: {
      bodyParser: {
        sizeLimit: '10mb'
      }
    }
  }


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

  const relationColumnsData = [{"columnName":"productId","relationModel":"product","relationModelKey":"name","isSelfRelation":false},{"columnName":"product","relationModel":"product","relationModelKey":"name","isSelfRelation":false}];
  
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
                if ("Int" === 'Int') {
                    where[filterField] = {
                        equals: parseInt(filterValue)
                    };
                } else if ("Int" === 'Boolean') {
                    where[filterField] = {
                        equals: filterValue.toLowerCase() === 'true'
                    };
                } else if ("Int" === 'DateTime') {
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
          
            if (filterField === "picture") {
                if ("File" === 'Int') {
                    where[filterField] = {
                        equals: parseInt(filterValue)
                    };
                } else if ("File" === 'Boolean') {
                    where[filterField] = {
                        equals: filterValue.toLowerCase() === 'true'
                    };
                } else if ("File" === 'DateTime') {
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
      
        if (sortField === 'productId') {
          
            orderBy['product'] = {
              name: sortOrder === 'ascend' ? 'asc' : 'desc'
            };
          
        }
      
        if (sortField === 'product') {
          
            orderBy['product'] = {
              name: sortOrder === 'ascend' ? 'asc' : 'desc'
            };
          
        }
      
    } else {
      orderBy[sortField] = sortOrder === 'ascend' ? 'asc' : 'desc';
    }
  }

  const idCondition = 
    
      
        Number(id)  
      
    
  
    
  ;

  switch (req.method) {
    case 'GET':
      try {
        if (id) {
          const result = await prisma.picture.findUnique({
            where: { id: idCondition },
            
              include: {
                
                    
                        
                            product: true, 
                        
                        
                    
                
                    
                        
                        
                    
                
                },
              
          });
          if (result) {
            res.status(200).json(result);
          } else {
            res.status(404).json({ error: "picture not found" });
          }
        } else {
          const results = await prisma.picture.findMany({
            skip,
            take,
            orderBy,
            where,
            
              include: {
                
                    
                        
                            product: true, 
                        
                        
                    
                
                    
                        
                        
                    
                
                },
              
          });
          const totalCount = await prisma.picture.count({ where });
          res.status(200).json({ data: results, pagination: {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            total: totalCount,
          }});
        }
      } catch (error) {
        res.status(500).json({ error: "Error fetching picture" });
      }
      break;

      case 'POST':
      try {
        const postData = { ...req.body };
        
        
          const savedFiles = {};
          if (postData.files && Array.isArray(postData.files)) {
            const fileUrls = await Promise.all(
              postData.files.map(async (file) => {
                return await uploadBase64ToUploads(file);
              })
            );
            savedFiles['picture'] = fileUrls.join(',');
          }
          delete postData.files;
        
    
        const newPicture = await prisma.picture.create({
          data: {
            ...postData,
            
                ...savedFiles,
            
            
              
                    
                    
                
            
              
                    
                    
                
            
        }
        });
        res.status(201).json(newPicture);
      } catch (error) {
        res.status(500).json({ error: "Error creating picture" });
      }
      break;
    
      case 'PUT':
      try {
        const putData = { ...req.body };
    
        const existingRecord = await prisma.picture.findUnique({
          where: { id: idCondition }
        });
    
        if (!existingRecord) {
          return res.status(404).json({ error: "picture not found" });
        }
    
        
          const savedFiles = {};
          if (putData.files && Array.isArray(putData.files)) {
            if (existingRecord['picture']) {
              const oldFiles = existingRecord['picture'].split(',');
              await Promise.all(oldFiles.map(async (oldFile) => {
                const oldFileName = oldFile.split('/').pop();
                const oldFilePath = path.join(process.cwd(), 'uploads', oldFileName);
                if (fs.existsSync(oldFilePath)) {
                  await fs.promises.unlink(oldFilePath);
                }
              }));
            }
    
            const fileUrls = await Promise.all(
              putData.files.map(async (file) => {
                return await uploadBase64ToUploads(file);
              })
            );
            savedFiles['picture'] = fileUrls.join(','); 
          }
          delete putData.files;
        
    
    
        const updatedPicture = await prisma.picture.update({
          where: { id: idCondition },
          data: {
            ...putData,
            
                ...savedFiles,
            
            
              
                    
                        ...(putData.productId ? {
                            productId: putData.productId,
                        } : {
                            productId: {
                                disconnect: true 
                            }
                        }),
                    
                    
                
            
              
                    
                    
                
            
        }
        });
    
        res.status(200).json(updatedPicture);
      } catch (error) {
        res.status(500).json({ error: "Error updating picture" });
      }
      break;

    case 'DELETE':
      try {
        const existingRecord = await prisma.picture.findUnique({
          where: { id: idCondition }
        });

         
          if (existingRecord) {
            await  deleteAssociatedFiles(existingRecord);
          }
        

        await prisma.picture.delete({
          where: { id: idCondition },
        });
        res.status(200).json({ message: "picture deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Error deleting picture" });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}