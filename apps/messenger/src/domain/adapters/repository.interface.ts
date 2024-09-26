import { FilterQuery, PopulateOptions } from "mongoose";
import { Conversation } from "../entities/conversation";
import { Message } from "../entities/message";




export interface IConversationRepository {
    create(conversation: Conversation): Promise<Conversation>;
    findAll(filterQuery: FilterQuery<Conversation>, popOptions?: PopulateOptions[]): Promise<Conversation[]>;
    findOne(filterQuery: FilterQuery<Conversation>): Promise<Conversation|null>,
    findByIdAndReplace(_id: string, conversation: Conversation): Promise<Conversation>;
    findByIdAndDelete(_id: string): Promise<Conversation>;
}


export interface IMessageRepository{
    create(message: Message): Promise<Message>;
    findAll(filterQuery: FilterQuery<Message>, popOptions?: PopulateOptions[]): Promise<Message[]>;
    findOne(filterQuery: FilterQuery<Message>): Promise<Message|null>,
    findByIdAndReplace(_id: string, message: Message): Promise<Message>;
    findByIdAndDelete(_id: string): Promise<Message>;
}