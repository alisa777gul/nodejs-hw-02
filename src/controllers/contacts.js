import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const contacts = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId: req.user._id,
    });

    if (contacts.totalItems === 0) {
      return res.status(200).json({
        status: 200,
        message: 'No contacts yet',

        data: {},
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId, req.user._id);

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContactController = async (req, res, next) => {
  try {
    console.log('User ID:', req.user._id);

    const photo = req.file;

    let photoUrl = '';

    if (photo) {
      photoUrl = await saveFileToCloudinary(photo);
    }

    const contact = await createContact(
      { ...req.body, ...(photoUrl && { photo: photoUrl }) },
      req.user._id,
    );
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const photo = req.file;

    let photoUrl;

    if (photo) photoUrl = await saveFileToCloudinary(photo);

    const updatedContact = await updateContact(
      contactId,
      {
        ...req.body,
        photo: photoUrl,
      },
      req.user._id,
    );

    if (!updatedContact) {
      next(createHttpError(404, 'Student not found'));
      return;
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    await deleteContact(contactId, req.user._id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
