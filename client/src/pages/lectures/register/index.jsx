import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EXAM_CONFIG } from "@/config/board";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { createLectureService } from "@/services/lecture";

export default function LectureRegisterPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm({
    defaultValues: {
      title: "",
      examType: "",
      price: "50000",
      specialties: "",
      description: "",
      curriculum: "",
      achievements: "",
      thumbnail: null,
      videos: [
        {
          title: "",
          description: "",
          file: null,
          fileName: "",
          duration: "",
          order: 1,
        }
      ]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "videos"
  });

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB 제한
        toast({
          variant: "destructive",
          title: "오류",
          description: "썸네일 이미지 크기는 5MB를 초과할 수 없습니다."
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = async (event, index) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) { // 500MB 제한
        toast({
          variant: "destructive",
          title: "오류",
          description: "동영상 크기는 500MB를 초과할 수 없습니다."
        });
        return;
      }

      // 비디오 메타데이터 로드
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function() {
        const duration = Math.round(video.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        form.setValue(`videos.${index}.duration`, formattedDuration);
        form.setValue(`videos.${index}.fileName`, file.name);
        form.setValue(`videos.${index}.file`, file);
        window.URL.revokeObjectURL(video.src);
      };
      video.src = URL.createObjectURL(file);

      // 초기 진행률 설정
      setUploadProgress(prev => ({ ...prev, [index]: 0 }));
    }
  };

  const onSubmit = async (values) => {
    try {
      setIsUploading(true);
      
      // FormData 생성
      const formData = new FormData();
      
      // 기본 정보 추가
      formData.append('title', values.title);
      formData.append('examType', values.examType);
      formData.append('description', values.description);
      formData.append('price', values.price);
  
      // 비디오 파일 추가
      values.videos.forEach((video, index) => {
        if (video.file) {
          const videoFileName = `video_${index}`;
          formData.append(videoFileName, video.file);
          
          formData.append(`${videoFileName}_meta`, JSON.stringify({
            title: video.title,
            description: video.description,
            order: index + 1
          }));
        }
      });
  
      const response = await createLectureService(formData, (progress) => {
        setUploadProgress(prev => ({
          ...prev,
          total: progress
        }));
      });
  
      toast({
        title: '성공',
        description: '강의가 성공적으로 등록되었습니다.'
      });
  
      navigate(`/lecture/${values.examType}`);
  
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        variant: "destructive",
        title: "오류",
        description: error.message || "강의 등록에 실패했습니다."
      });
    } finally {
      setIsUploading(false);
      setUploadProgress({});  // 초기화할 때도 빈 객체로
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>강의 등록</CardTitle>
          <CardDescription>
            새로운 강의를 등록하기 위한 정보를 입력해주세요.
          </CardDescription>
        </CardHeader>
  
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-6">
              {/* 시험 유형 */}
              <FormField
                control={form.control}
                name="examType"
                rules={{ required: "시험 유형을 선택해주세요" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>시험 유형</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="시험 유형을 선택해주세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(EXAM_CONFIG).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              {/* 강의 제목 */}
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "강의 제목을 입력해주세요" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>강의 제목</FormLabel>
                    <FormControl>
                      <Input placeholder="강의 제목을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              {/* 강의 설명 */}
              <FormField
                control={form.control}
                name="description"
                rules={{ required: "강의 설명을 입력해주세요" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>강의 설명</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="강의에 대한 설명을 입력하세요"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              {/* 가격 */}
              <FormField
                control={form.control}
                name="price"
                rules={{ 
                  required: "가격을 입력해주세요",
                  min: {
                    value: 0,
                    message: "0원 이상의 가격을 입력해주세요"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>가격 (원)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="가격을 입력하세요"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              {/* 동영상 섹션 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>강의 동영상</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({
                      title: "",
                      description: "",
                      file: null,
                      fileName: "",
                      duration: "",
                      order: fields.length + 1,
                    })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    동영상 추가
                  </Button>
                </div>
  
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <Card key={field.id}>
                      <CardContent className="pt-6 space-y-4">
                        {/* 동영상 제목 */}
                        <FormField
                          control={form.control}
                          name={`videos.${index}.title`}
                          rules={{ required: "동영상 제목을 입력해주세요" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>동영상 제목</FormLabel>
                              <FormControl>
                                <Input placeholder="예: 1강 - 강의 소개" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
  
                        {/* 동영상 설명 */}
                        <FormField
                          control={form.control}
                          name={`videos.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>동영상 설명</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="동영상에 대한 설명을 입력하세요"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
  
                        {/* 파일 업로드 */}
                        <div className="space-y-2">
                          <Label>동영상 파일</Label>
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "relative w-full h-24 border-2 border-dashed rounded-lg",
                              "flex items-center justify-center",
                              form.watch(`videos.${index}.fileName`) && "border-primary"
                            )}>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => handleVideoChange(e, index)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              {form.watch(`videos.${index}.fileName`) ? (
                                <div className="text-center">
                                  <p className="font-medium">
                                    {form.watch(`videos.${index}.fileName`)}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {form.watch(`videos.${index}.duration`)}
                                  </p>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center text-muted-foreground">
                                  <Upload className="w-8 h-8 mb-2" />
                                  <p className="text-sm">동영상을 업로드하세요</p>
                                  <p className="text-xs">최대 500MB</p>
                                </div>
                              )}
                            </div>
                            
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => remove(index)}
                              className="flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          {/* 개별 파일 업로드 진행률 */}
                          {uploadProgress[index] !== undefined && (
                            <div className="space-y-1">
                              <Progress value={uploadProgress[index]} className="h-2" />
                              <p className="text-sm text-muted-foreground text-right">
                                {Math.round(uploadProgress[index])}%
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
  
                  {/* 전체 업로드 진행률 */}
                  {isUploading && uploadProgress.total && (
                    <Card>
                      <CardContent className="py-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>전체 업로드 진행률</span>
                            <span>{Math.round(uploadProgress.total)}%</span>
                          </div>
                          <Progress value={uploadProgress.total} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </CardContent>
  
            <CardFooter className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isUploading}
              >
                취소
              </Button>
              <Button 
                type="submit"
                disabled={isUploading}
              >
                {isUploading ? "업로드 중..." : "강의 등록"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}